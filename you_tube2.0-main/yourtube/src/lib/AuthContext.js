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

  const login = (userdata) => {
    setUser(userdata);
    localStorage.setItem("user", JSON.stringify(userdata));
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("user");

    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const handlegooglesignin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      const payload = {
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        image: firebaseUser.photoURL || "https://github.com/shadcn.png",
        device: navigator.userAgent,
      };

    const response = await axiosInstance.post("/user/login", payload);

if (response.data.otpRequired) {
  setOtpUserId(response.data.userId);
  setOtpOpen(true);
  return;
}

login(response.data.result);
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const payload = {
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            image: firebaseUser.photoURL || "https://github.com/shadcn.png",
            device: navigator.userAgent,
          };

          const response = await axiosInstance.post("/user/login", payload);

          if (response.data.otpRequired) {
  setOtpUserId(response.data.userId);
  setOtpOpen(true);
  return;
}

login(response.data.result);
        } catch (error) {
          console.error(error);
          logout();
        }
      } else {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
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
