import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function findUserInFirestore(userId) {
  if (!userId) return null;

  try {
    const userDocRef = doc(db, "users", userId);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      return userSnapshot.data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching user from Firestore:", error);
    return null;
  }
}
