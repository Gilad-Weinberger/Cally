import { createLemonSqueezyCheckout } from "@/lib/lemonsqueezy";
import { findUserInFirestore } from "@/lib/firestore";
import { NextRequest, NextResponse } from "next/server";

// This function is used to create a Lemon Squeezy Checkout Session (one-time payment or subscription)
// It's called by the <PricingCheckout /> component
// By default, it doesn't force users to be authenticated. But if they are, it will prefill the Checkout data with their email and/or credit card
export async function POST(req) {
  const body = await req.json();

  if (!body.variantId) {
    return NextResponse.json(
      { error: "Variant ID is required" },
      { status: 400 }
    );
  } else if (!body.redirectUrl) {
    return NextResponse.json(
      { error: "Redirect URL is required" },
      { status: 400 }
    );
  }

  try {
    // Get user info from request body if provided
    const userId = body.userId;
    const user = userId ? await findUserInFirestore(userId) : null;

    const { variantId, redirectUrl } = body;

    console.log("Creating checkout with variant ID:", variantId);

    const checkoutURL = await createLemonSqueezyCheckout({
      variantId,
      redirectUrl,
      // If user is logged in, this will automatically prefill Checkout data like email and/or credit card for faster checkout
      userId: userId,
      email: user?.email || body.email,
    });

    if (!checkoutURL) {
      return NextResponse.json(
        {
          error:
            "Failed to create checkout. Please check your Lemon Squeezy configuration.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: checkoutURL });
  } catch (e) {
    console.error("Lemon Squeezy checkout error:", e);
    return NextResponse.json(
      {
        error: "Failed to create checkout",
        details: e?.message || "Unknown error",
        variantId: body.variantId,
      },
      { status: 500 }
    );
  }
}
