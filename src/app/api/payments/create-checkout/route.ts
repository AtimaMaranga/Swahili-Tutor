import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/client';

/**
 * Create Stripe Checkout Session for wallet top-up
 * POST /api/payments/create-checkout
 */
export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'USD', userId } = await request.json();

    // Validate input
    if (!amount || amount < 500) {
      return NextResponse.json(
        { error: 'Minimum amount is $5.00' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // In production, this would create a Stripe checkout session
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ['card'],
    //   line_items: [
    //     {
    //       price_data: {
    //         currency: currency.toLowerCase(),
    //         product_data: {
    //           name: 'Learn Swahili Credits',
    //           description: `Add ${formatCurrency(amount)} to your wallet`,
    //         },
    //         unit_amount: amount,
    //       },
    //       quantity: 1,
    //     },
    //   ],
    //   mode: 'payment',
    //   success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/student/wallet?success=true`,
    //   cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/student/wallet?canceled=true`,
    //   metadata: {
    //     userId,
    //     type: 'wallet_topup',
    //   },
    // });

    // For development, return a mock checkout URL
    return NextResponse.json({
      checkoutUrl: `/dashboard/student/wallet?mock_payment=true&amount=${amount}`,
      sessionId: `mock_session_${Date.now()}`,
    });
  } catch (error) {
    console.error('Checkout creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
