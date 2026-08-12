// src/app/layout.tsx

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        {/* টপে সবসময় Navbar থাকবে */}
        <Navbar/>

        {/* মাঝখানে পেজের কনটেন্ট (Hero, Services ইত্যাদি) লোড হবে */}
        <main className="min-h-screen">{children}</main>
    <Footer/>
      </body>
    </html>
  );
}