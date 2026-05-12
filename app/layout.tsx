import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dxmdvietnam.vn"),
  title: {
    default: "Bản Đồ Bất Động Sản | DXMD Vietnam",
    template: "%s | Bản Đồ Bất Động Sản",
  },
  icons: {
    icon: "https://dxmdvietnam.vn/files/2022/07/favicon-dxmd-vietnam.png",
    shortcut: "https://dxmdvietnam.vn/files/2022/07/favicon-dxmd-vietnam.png",
    apple: "https://dxmdvietnam.vn/files/2022/07/favicon-dxmd-vietnam.png",
  },
  description: "Trải nghiệm bản đồ dự án bất động sản tương tác 3D. Khám phá các dự án tiềm năng, xem thông tin nhà mẫu, video review và nhận chỉ đường chính xác.",
  keywords: ["bản đồ bất động sản", "DXMD Vietnam", "bản đồ dự án", "bất động sản 3D", "real estate map", "nhà mẫu"],
  authors: [{ name: "DXMD Vietnam" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "/",
    title: "Bản Đồ Bất Động Sản Tương Tác | DXMD Vietnam",
    description: "Khám phá các dự án bất động sản qua không gian bản đồ mở. Xem chi tiết vị trí, nhà mẫu và tìm lộ trình di chuyển nhanh chóng.",
    siteName: "DXMD RealMap",
    images: [
      {
        url: "https://dxmdvietnam.vn/wp-content/uploads/2023/10/banner-dxmd.jpg", // Fallback banner default
        width: 1200,
        height: 630,
        alt: "DXMD Vietnam Real Estate Map",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bản Đồ Bất Động Sản Tương Tác | DXMD Vietnam",
    description: "Khám phá các dự án bất động sản qua không gian bản đồ mở. Xem chi tiết vị trí, nhà mẫu và tìm lộ trình di chuyển nhanh chóng.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
