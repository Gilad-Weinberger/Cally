import { NextResponse } from "next/server";
import { createCustomerPortal } from "@/lib/lemonsqueezy";
import { useAuth } from "@/context/AuthContext";
import { findUserInFirestore } from "@/lib/firestore";

export async function POST() {
  authUser = useAuth();

  if (authUser) {
    try {
      const user = await findUserInFirestore(authUser);

      if (!user?.customerId) {
        return NextResponse.json(
          {
            error:
              "You don't have a billing account yet. Make a purchase first.",
          },
          { status: 400 }
        );
      }

      const url = await createCustomerPortal({
        customerId: user.customerId,
      });

      return NextResponse.json({
        url,
      });
    } catch (e) {
      console.error(e);
      return NextResponse.json({ error: e?.message }, { status: 500 });
    }
  } else {
    // Not Signed in.
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
}
