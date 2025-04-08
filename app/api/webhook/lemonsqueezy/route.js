import { NextResponse } from "next/server";
import { headers } from "next/headers";
import crypto from "crypto";
import config from "@/lib/config";
import { useAuth } from "@/context/AuthContext";
import { findUserInFirestore } from "@/lib/firestore";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// This is where we receive LemonSqueezy webhook events
// It used to update the user data, send emails, etc...
export async function POST(req) {
  const secret = process.env.LEMONSQUEEZY_SIGNING_SECRET;
  if (!secret) {
    return new Response("LEMONSQUEEZY_SIGNING_SECRET is required.", {
      status: 400,
    });
  }

  const authUser = useAuth();

  // Verify the signature
  const text = await req.text();

  const hmac = crypto.createHmac("sha256", secret);
  const digest = Buffer.from(hmac.update(text).digest("hex"), "utf8");
  const signature = Buffer.from(headers().get("x-signature"), "utf8");

  if (!crypto.timingSafeEqual(digest, signature)) {
    return new Response("Invalid signature.", {
      status: 400,
    });
  }

  // Get the payload
  const payload = JSON.parse(text);

  const eventName = payload.meta.event_name;
  const customerId = payload.data.attributes.customer_id.toString();

  try {
    switch (eventName) {
      case "order_created": {
        // ✅ Grant access to the product
        const userId = payload.meta?.custom_data?.userId;

        const email = payload.data.attributes.user_email;
        const name = payload.data.attributes.user_name;
        const variantId =
          payload.data.attributes.first_order_item.variant_id.toString();

        const plan = config.lemonsqueezy.plans.find(
          (p) => p.variantId === variantId
        );
        if (!plan) {
          throw new Error("Plan not found for variantId:", variantId);
        }

        let userDoc;
        let userRef;

        // Get or create the user. userId is normally pass in the checkout session (clientReferenceID) to identify the user when we get the webhook event
        if (authUser.uid) {
          userDoc = await findUserInFirestore(authUser.uid);
          userRef = doc(db, "users", authUser.uid);
        } else if (email) {
          const usersCollection = collection(db, "users");
          const q = query(usersCollection, where("email", "==", email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            userDoc = querySnapshot.docs[0].data();
            userRef = querySnapshot.docs[0].ref;
          } else {
            throw new Error("No user found");
          }
        } else {
          throw new Error("No user found");
        }

        // Update user data in Firestore
        await updateDoc(userRef, {
          variantId: variantId,
          customerId: customerId,
          hasAccess: true,
          updatedAt: new Date().toISOString(),
        });

        break;
      }

      case "subscription_cancelled": {
        // Find user by customerId in Firestore
        const usersCollection = collection(db, "users");
        const q = query(usersCollection, where("customerId", "==", customerId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userRef = querySnapshot.docs[0].ref;
          await updateDoc(userRef, {
            hasAccess: false,
            updatedAt: new Date().toISOString(),
          });
        }

        break;
      }

      default:
    }
  } catch (e) {
    console.error("lemonsqueezy error: ", e.message);
  }

  return NextResponse.json({});
}
