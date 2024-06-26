import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "FinTrack",
    description: "This is a Finance Tracker App",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Nav />
                {children}
            </body>
        </html>
    );
}
