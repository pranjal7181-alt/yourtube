import OtpDialog from "@/components/OtpDialog";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "./firebase";
import axiosInstance from "./axiosinstance";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpUserId, setOtpUserId] = useState("");

  const login = (userData) => {
    setUser(userData);

    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const createDemoUser = (firebaseUser) => {
    return {
      _id: firebaseUser.uid || "demo-user",
      email: firebaseUser.email || "demo@example.com",
      name: firebaseUser.displayName || "Demo User",
      image: firebaseUser.photoURL || "https://github.com/shadcn.png",
      channelname: firebaseUser.displayName || "Demo Channel",
      description: "Demo account for the deployed YouTube clone.",
      plan: "free",
      theme: "dark",
      isDemo: true,
    };
  };

  const logout = async () => {
    setUser(null);

    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }

    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const authenticateUser = async (firebaseUser) => {
    const payload = {
      email: firebaseUser.email,
      name: firebaseUser.displayName,
      image: firebaseUser.photoURL || "https://github.com/shadcn.png",
      device:
        typeof navigator !== "undefined" ? navigator.userAgent : "unknown-device",
    };

    try {
      const response = await axiosInstance.post("/user/login", payload);

      if (response.data?.otpRequired) {
        setOtpUserId(response.data.userId);
        setOtpOpen(true);
        return;
      }

      if (response.data?.result) {
        login(response.data.result);
        return;
      }

      login(createDemoUser(firebaseUser));
    } catch (error) {
      console.warn(
        "Backend unavailable. Signing in with demo profile.",
        error
      );

      login(createDemoUser(firebaseUser));
    }
  };

  const handlegooglesignin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      await authenticateUser(result.user);
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await authenticateUser(firebaseUser);
        return;
      }

      if (typeof window !== "undefined") {
        const savedUser = localStorage.getItem("user");

        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch (error) {
            console.error("Invalid saved user data:", error);
            localStorage.removeItem("user");
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        handlegooglesignin,
      }}
    >
      {children}

      <OtpDialog
        open={otpOpen}
        userId={otpUserId}
        onClose={() => setOtpOpen(false)}
      />
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);