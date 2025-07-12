"use client"; // Required for hooks like useState, useEffect

import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, Sun, Moon } from "lucide-react";
import React, { useState, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

// --- Theme Toggle Component ---
const ThemeToggle = () => {
    const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode

    // On component mount, apply the theme
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            document.documentElement.style.backgroundColor = 'black';
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.backgroundColor = ''; // Revert to CSS default
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    return (
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
};


// --- Header Component ---
const AppHeader = () => {
    return (
        <header className="bg-card text-card-foreground border-b border-border sticky top-0 z-50">
            <nav className="container mx-auto flex items-center justify-between p-3 md:p-4 gap-4 md:gap-8">
                {/* Left Side: Logo and Nav */}
                <div className="flex items-center gap-6">
                    <Link href="/" className="text-lg md:text-xl font-bold text-foreground hover:text-primary/90 transition-colors flex items-center gap-2">
                        <div className="bg-foreground text-background h-7 w-7 flex items-center justify-center rounded-md font-bold">S</div>
                        <span className="hidden sm:inline">Stack It</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-4 text-sm font-medium text-muted-foreground">
                        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                        <Link href="/community" className="hover:text-foreground transition-colors">Community</Link>
                    </div>
                </div>

                {/* Center: Search Bar */}
                <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-lg">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            className="w-full pl-10"
                        />
                    </div>
                </div>

                {/* Right Side: Actions */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                        <Bell className="h-5 w-5" />
                        <span className="sr-only">Notifications</span>
                    </Button>
                    <ThemeToggle /> {/* Added theme toggle button */}
                    <Button asChild>
                        <Link href="/screens/login">Login</Link>
                    </Button>
                    <Button asChild variant="secondary">
                        <Link href="/screens/register">Sign Up</Link>
                    </Button>
                </div>
            </nav>
        </header>
    );
};

// --- Root Layout ---
export default function RootLayout({ children }) {
    return (
        // The 'dark' class is now managed by the ThemeToggle component
        <html lang="en">
        <head>
            {/* Metadata can be placed here if not using the metadata object */}
        </head>
        <body className={`${inter.className} bg-background text-foreground`}>
        <AppHeader />
        <main>{children}</main>
        </body>
        </html>
    );
}
