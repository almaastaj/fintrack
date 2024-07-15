"use client";
import { Inter } from "next/font/google";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import Nav from "@/components/Navigation";
import FinanceContextProvider from "@/lib/store/finance-context";
import AuthContextProvider from "@/lib/store/auth-context";

const inter = Inter({ subsets: ["latin"] });

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
                <AuthContextProvider>
                    <FinanceContextProvider>
                        <ToastContainer />
                        <Nav />
                        {children}
                    </FinanceContextProvider>
                </AuthContextProvider>
            </body>
        </html>
    );
}
