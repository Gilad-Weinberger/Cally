import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebase";

export async function signInWithEmail(email, password) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    throw new Error(getErrorMessage(error.code));
  }
}

export async function signUpWithEmail(email, password, name) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    return result.user;
  } catch (error) {
    throw new Error(getErrorMessage(error.code));
  }
}

export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    throw new Error(getErrorMessage(error.code));
  }
}

function getErrorMessage(code) {
  switch (code) {
    case "auth/email-already-in-use":
      return "This email is already registered";
    case "auth/invalid-email":
      return "Invalid email address";
    case "auth/weak-password":
      return "Password should be at least 6 characters";
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Invalid email or password";
    default:
      return "An error occurred. Please try again";
  }
}
