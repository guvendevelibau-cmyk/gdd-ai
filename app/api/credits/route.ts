import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.LEMONSQUEEZY_API_KEY;

// Otomatik Store ID çekme fonksiyonu
async function getStoreId(): Promise<string | null> {
  try {
    const response = await fetch('https://api.lemonsqueezy.com/v1/stores', {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${API_KEY}`,
      },
    });

    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      const storeId = data.data[0].id;
      console.log('✅ Store ID found:', storeId);
      return storeId;
    }
    
    console.error('No stores found');
    return null;
  } catch (error) {
    console.error('Error fetching store:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { variantId, userId, userEmail } = await request.json();

    if (!variantId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Store ID'yi otomatik al
    const storeId = await getStoreId();
    
    if (!storeId) {
      return NextResponse.json({ error: 'Could not fetch store ID' }, { status: 500 });
    }

    console.log('Creating checkout for:', { variantId, userId, storeId });

    // Lemon Squeezy Checkout oluştur
    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              custom: {
                user_id: userId,
              },
              email: userEmail || undefined,
            },
            product_options: {
              redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/generator?purchase=success`,
            },
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: storeId.toString(),
              },
            },
            variant: {
              data: {
                type: 'variants',
                id: variantId.toString(),
              },
            },
          },
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Lemon Squeezy Error:', JSON.stringify(data, null, 2));
      return NextResponse.json({ 
        error: 'Failed to create checkout',
        details: data 
      }, { status: 500 });
    }

    const checkoutUrl = data.data?.attributes?.url;

    if (!checkoutUrl) {
      console.error('No checkout URL in response:', data);
      return NextResponse.json({ error: 'No checkout URL returned' }, { status: 500 });
    }

    console.log('✅ Checkout URL created:', checkoutUrl);
    return NextResponse.json({ checkoutUrl });

  } catch (error: any) {
    console.error('Checkout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}