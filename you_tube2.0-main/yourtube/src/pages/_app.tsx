import "@stream-io/video-react-sdk/dist/css/styles.css";
import "@/styles/globals.css";

import type { AppProps } from "next/app";
import { useUser } from "../lib/AuthContext";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";

import { UserProvider } from "../lib/AuthContext";
import StreamProvider from "@/lib/StreamProvider";

function AppContent({ Component, pageProps, router }: AppProps) {
  const { user } = useUser();

  const isWatchParty = router.pathname.startsWith("/watch-party");

  const bgClass = user?.theme === "light"
    ? "min-h-screen bg-white text-black"
    : "min-h-screen bg-gray-900 text-white";

  return (
    <StreamProvider>
      {isWatchParty ? (
        <>
          <Toaster />
          <Component {...pageProps} />
        </>
      ) : (
        <div className={bgClass}>
          <title>Your-Tube Clone</title>

          <Header />

          <Toaster />

          <div className="flex">
            <Sidebar />
            <Component {...pageProps} />
          </div>
        </div>
      )}
    </StreamProvider>
  );
}

export default function App(props: AppProps) {
  return (
    <UserProvider>
      <AppContent {...props} />
    </UserProvider>
  );
}