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

export async function isUserAdmin(userId) {
  if (!userId) return false;
  
  try {
    const userData = await findUserInFirestore(userId);
    return userData?.role === "admin";
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}
