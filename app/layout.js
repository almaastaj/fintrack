"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Navigation";
import FinanceContextProvider from "@/lib/store/finance-context";

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//     title: "FinTrack",
//     description: "This is a Finance Tracker App",
// };

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <title>FinTrack</title>
                <meta
                    content="width=device-width, initial-scale=1"
                    name="viewport"
                />
                <meta
                    name="description"
                    content="This is a Finance Tracker App"
                />
                <link rel="icon" href="/favicon.ico" />
            </head>

            <body className={inter.className}>
                <FinanceContextProvider>
                    <Nav />
                    {children}
                </FinanceContextProvider>
            </body>
        </html>
    );
}
