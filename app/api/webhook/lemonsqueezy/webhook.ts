import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// Maps both UUID-style variant IDs (from .env) and numeric IDs to credit packages
const CREDIT_PACKAGES: Record<string, { credits: number; name: string }> = {
  [process.env.NEXT_PUBLIC_LS_STARTER_VARIANT_ID || '0887f6bd-9f00-46ea-a3e6-c717ca731de2']: { credits: 10, name: 'Starter Pack' },
  [process.env.NEXT_PUBLIC_LS_PRO_VARIANT_ID || '8848a565-d48f-4a53-a123-12d4636bd3b5']: { credits: 50, name: 'Pro Pack' },
};

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

    if (webhookSecret && !verifySignature(rawBody, signature, webhookSecret)) {
      console.error('❌ Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta?.event_name;

    console.log('📦 Lemon Squeezy Webhook:', eventName);

    if (eventName === 'order_created') {
      const { data, meta } = payload;

      const orderId = data.id;
      const status = data.attributes?.status;
      const userEmail = data.attributes?.user_email;
      const userId = meta?.custom_data?.user_id;
      const isTestMode = data.attributes?.test_mode === true;

      // LemonSqueezy sends variant_id as an integer — convert to string for lookup
      const variantIdRaw = data.attributes?.first_order_item?.variant_id;
      const variantId = variantIdRaw?.toString();

      console.log('📋 Order:', { orderId, status, userEmail, userId, variantId, isTestMode });

      // Block test-mode orders from adding real credits
      if (isTestMode) {
        console.warn(`🧪 Test-mode order ${orderId} ignored — no credits added.`);
        return NextResponse.json({ received: true, ignored: 'test_mode' });
      }

      if (status === 'paid' && userId && variantId) {
        const creditPackage = CREDIT_PACKAGES[variantId];

        if (creditPackage) {
          await adminDb.doc(`users/${userId}`).update({
            credits: FieldValue.increment(creditPackage.credits),
            totalCreditsPurchased: FieldValue.increment(creditPackage.credits),
            lastPurchaseAt: new Date().toISOString(),
          });

          console.log(`✅ Added ${creditPackage.credits} credits to user ${userId}`);

          return NextResponse.json({
            received: true,
            userId,
            credits: creditPackage.credits,
            packageName: creditPackage.name,
            orderId,
          });
        } else {
          // Log unrecognised variant so it can be mapped in CREDIT_PACKAGES
          console.warn(`⚠️ Unknown variant ID: ${variantId}. Known IDs:`, Object.keys(CREDIT_PACKAGES));
        }
      }
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Webhook endpoint active' });
}
