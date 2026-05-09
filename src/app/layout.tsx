import { Lexend, Open_Sans, Source_Code_Pro } from "next/font/google";
import type { Metadata } from "next";

import "./styles/index.css";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/all";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-lexend",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-open-sans",
});

const code = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-code",
});

export const metadata: Metadata = {
  title: "Wilson Yu",
  description: "Wilson Yu, a 17 year old computer science student based in Ottawa, Canada.",
  icons: "https://avatars.githubusercontent.com/u/139521392?s=32",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${lexend.variable} ${openSans.variable} ${code.variable}`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
