"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out");
      // Only redirect to signin if not on the homepage
      const currentPath = window.location.pathname;
      if (currentPath !== "/") {
        router.push("/auth/signin");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  async function createUser(user) {
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      await setDoc(userRef, {
        id: user.uid,
        email: user.email,
        createdAt: new Date().toISOString(),
        customerId: "",
        variantId: "",
        hasAccess: false,
        role: "client",
      });
      console.log("User created in the database.");
      return true;
    }
    console.log("User already exists.");
    return false;
  }

  async function createCalendar(userId) {
    const calendarsRef = collection(db, "calendars");
    const q = query(
      calendarsRef,
      where("userId", "==", userId),
      where("name", "==", "General")
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      const calendarRef = doc(collection(db, "calendars"));
      await setDoc(calendarRef, {
        id: calendarRef.id,
        name: "General",
        userId: userId,
        createdAt: new Date().toISOString(),
      });
      console.log("Calendar created for user");
    } else {
      console.log("General calendar already exists for this user");
    }
  }

  async function createColorCode(userId) {
    const colorCodesRef = collection(db, "colorCodes");
    const q = query(colorCodesRef, where("userId", "==", userId));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      const colorCodeRef = doc(collection(db, "colorCodes"));
      await setDoc(colorCodeRef, {
        id: colorCodeRef.id,
        userId: userId,
        colorCodes: {},
        createdAt: new Date().toISOString(),
      });
      console.log("Default color code created for user");
    } else {
      console.log("Default color code already exists for this user");
    }
  }

  useEffect(() => {
    console.log("AuthContext - Setting up auth state listener");

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("AuthContext - Auth state changed:", {
        isAuthenticated: !!user,
        userId: user?.uid,
      });

      if (user) {
        setUser(user);
        const isNewUser = await createUser(user);
        if (isNewUser) {
          await createCalendar(user.uid);
          await createColorCode(user.uid);
        }
      } else {
        setUser(null);
        const pathname = window.location.pathname;
        console.log("AuthContext - No user, current pathname:", pathname);

        // Only redirect to signin if not already on an auth page or home
        if (
          !pathname.startsWith("/auth/") &&
          pathname !== "/" &&
          // Don't redirect if we're in the Google OAuth flow
          !pathname.startsWith("/api/google-calendar/")
        ) {
          console.log(
            "AuthContext - Redirecting to signin page from:",
            pathname
          );
          router.push("/auth/signin");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
