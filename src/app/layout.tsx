import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import RootLayoutClient from "@/components/RootLayout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AICoding基地",
  description: "为开发者精选的AI工具和编程资源平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        {/* 51.la 网站访问量统计 */}
        <Script
          id="LA_COLLECT"
          src="//sdk.51.la/js-sdk-pro.min.js"
          strategy="beforeInteractive"
        />
        <Script
          id="51la-init"
          strategy="beforeInteractive"
        >
          {`LA.init({id:"3O9o1FIp3fpK18Yd",ck:"3O9o1FIp3fpK18Yd"})`}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}
