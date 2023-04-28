import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <div className="z-[-2] bg-[length:1440px_100%] bg-[#101010] top-0 left-0 right-0 w-full h-full fixed"></div>
      <div className="z-[-1] opacity-10 bg-repeat top-0 left-0 right-0 w-full h-full fixed"></div>
      <Component {...pageProps} />
      <Analytics />
    </div>
  );
}

export default MyApp;
