import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/client';

/**
 * Stripe Webhook Handler
 * POST /api/payments/webhook
 *
 * Handles:
 * - checkout.session.completed: Add funds to wallet
 * - payment_intent.succeeded: Confirm payment
 * - payment_intent.failed: Handle failures
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    // In production, verify webhook signature
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // const event = stripe.webhooks.constructEvent(
    //   body,
    //   signature!,
    //   process.env.STRIPE_WEBHOOK_SECRET!
    // );

    // For development, parse body directly
    const event = JSON.parse(body);

    const supabase = createServerClient();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { userId, type } = session.metadata;

        if (type === 'wallet_topup') {
          const amountCents = session.amount_total;

          // Get user's wallet
          const { data: wallet } = await supabase
            .from('wallets')
            .select('id, balance_cents')
            .eq('user_id', userId)
            .single();

          if (wallet) {
            // Add funds to wallet using the atomic function
            await supabase.rpc('add_to_wallet', {
              p_wallet_id: wallet.id,
              p_amount_cents: amountCents,
              p_description: `Wallet top-up via Stripe`,
              p_type: 'deposit',
              p_reference_id: session.id,
            });
          }
        }
        break;
      }

      case 'payment_intent.succeeded': {
        console.log('Payment succeeded:', event.data.object.id);
        break;
      }

      case 'payment_intent.failed': {
        console.log('Payment failed:', event.data.object.id);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
