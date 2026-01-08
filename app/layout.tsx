import type { Metadata } from "next";
import { Old_Standard_TT } from "next/font/google";
import "./globals.css";
import VideoBackground from "@/components/VideoBackground";

const oldStandardTT = Old_Standard_TT({
  weight: ["400", "700"],
  variable: "--font-old-standard",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Useful Toolbox - Collection of Daily Tools",
  description: "A comprehensive collection of tools designed to simplify daily tasks. PDF manipulation, image processing, and more.",
  keywords: ["tools", "PDF", "image", "utilities"],
  authors: [{ name: "Rick G." }],
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "Useful Toolbox",
    description: "A comprehensive collection of tools designed to simplify daily tasks.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${oldStandardTT.variable} antialiased`}
      >
        <VideoBackground />
        {children}
      </body>
    </html>
  );
}
