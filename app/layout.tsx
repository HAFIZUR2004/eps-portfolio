// src/app/layout.tsx

import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-black text-white antialiased">
          {/* টপে সবসময় Navbar থাকবে */}
         

          {/* মাঝখানে পেজের কনটেন্ট (Hero, Services ইত্যাদি) লোড হবে */}
          <main className="min-h-screen">{children}</main>

          {/* বটমে সবসময় Footer থাকবে */}
          
        </body>
      </html>
    </ClerkProvider>
  );
}