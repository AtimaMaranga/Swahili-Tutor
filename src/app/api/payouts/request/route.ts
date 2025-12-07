import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/client';

/**
 * Request Payout to M-Pesa or Bank
 * POST /api/payouts/request
 *
 * For tutors to withdraw their earnings
 */
export async function POST(request: NextRequest) {
  try {
    const {
      tutorId,
      amountCents,
      currency = 'KES',
      payoutMethod,
      mobileNumber,
      bankAccount,
    } = await request.json();

    // Validate input
    if (!tutorId || !amountCents || !payoutMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Minimum payout amounts
    const minimums: Record<string, number> = {
      KES: 50000, // 500 KES
      TZS: 100000, // 1000 TZS
      UGX: 200000, // 2000 UGX
    };

    if (amountCents < (minimums[currency] || 50000)) {
      return NextResponse.json(
        { error: `Minimum payout is ${minimums[currency] / 100} ${currency}` },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Check tutor's available balance
    // In a real app, you'd track tutor earnings separately
    // For now, we'll create the payout request

    // Create payout record
    const { data: payout, error: payoutError } = await supabase
      .from('payouts')
      .insert({
        tutor_id: tutorId,
        amount_cents: amountCents,
        currency,
        status: 'pending',
        payout_method: payoutMethod,
      })
      .select()
      .single();

    if (payoutError) {
      throw payoutError;
    }

    // In production, initiate payout via Paystack/Flutterwave
    // For M-Pesa:
    // const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY!);
    // const transfer = await paystack.transfers.create({
    //   source: 'balance',
    //   reason: 'Tutor payout - Learn Swahili',
    //   amount: amountCents,
    //   recipient: recipientCode, // Created earlier for the tutor
    // });

    return NextResponse.json({
      success: true,
      payout,
      message: 'Payout request submitted. Processing usually takes 1-2 business days.',
    });
  } catch (error) {
    console.error('Payout request error:', error);
    return NextResponse.json(
      { error: 'Failed to process payout request' },
      { status: 500 }
    );
  }
}
