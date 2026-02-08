import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Variant ID -> Credits mapping
const CREDIT_PACKAGES: Record<string, { credits: number; name: string }> = {
  '0887f6bd-9f00-46ea-a3e6-c717ca731de2': { credits: 10, name: 'Starter Pack' },
  '8848a565-d48f-4a53-a123-12d4636bd3b5': { credits: 50, name: 'Pro Pack' },
};

// Webhook imza doğrulama
function verifySignature(payload: string, signature: string, secret: string): boolean {
  try {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(payload).digest('hex');
    return signature === digest;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-signature') || '';
    const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '';

    // İmza doğrulama
    if (webhookSecret && !verifySignature(rawBody, signature, webhookSecret)) {
      console.error('❌ Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta?.event_name;

    console.log('📦 Lemon Squeezy Webhook:', eventName);

    // order_created event'i işle
    if (eventName === 'order_created') {
      const { data, meta } = payload;
      
      const orderId = data.id;
      const status = data.attributes?.status;
      const userEmail = data.attributes?.user_email;
      const userId = meta?.custom_data?.user_id;
      const variantId = data.attributes?.first_order_item?.variant_id?.toString();
      
      console.log('📋 Order:', { orderId, status, userEmail, userId, variantId });

      if (status === 'paid' && userId && variantId) {
        const creditPackage = CREDIT_PACKAGES[variantId];
        
        if (creditPackage) {
          console.log(`✅ Adding ${creditPackage.credits} credits to user ${userId}`);
          
          // Firebase client SDK ile kredileri güncelle
          // Bu işlem frontend'den de tetiklenebilir (success page'de)
          // Şimdilik log'layalım - bir sonraki adımda Firebase Admin ekleyeceğiz
          
          return NextResponse.json({ 
            received: true,
            action: 'credits_to_add',
            userId,
            credits: creditPackage.credits,
            packageName: creditPackage.name,
            orderId,
          });
        }
      }
    }

    return NextResponse.json({ received: true });
    
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET endpoint for webhook verification
export async function GET() {
  return NextResponse.json({ status: 'Webhook endpoint active' });
}