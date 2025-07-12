"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// --- Register Page Component ---
export default function RegisterPage() {
    // State to manage the visibility of the OTP input field
    const [isVerifying, setIsVerifying] = useState(false);

    const handleVerifyClick = () => {
        // In a real app, this would trigger an API call to send an OTP
        setIsVerifying(true);
    };

    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Create an account</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your information to create an account
                        </p>
                    </div>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="full-name">Full Name</Label>
                            <Input id="full-name" placeholder="Max Robinson" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" placeholder="max_robinson" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    disabled={isVerifying} // Disable input after starting verification
                                />
                                <Button type="button" variant="outline" onClick={handleVerifyClick} disabled={isVerifying}>
                                    Verify
                                </Button>
                            </div>
                        </div>

                        {/* Conditionally render the OTP input field */}
                        {isVerifying && (
                            <div className="grid gap-2">
                                <Label htmlFor="otp">Verification Code</Label>
                                <Input id="otp" placeholder="Enter OTP sent to your email" required />
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input id="confirm-password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full">
                            Create account
                        </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/screens/login" className="underline">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
            <div className="hidden bg-muted lg:block">
                <Image
                    src="/login-background.jpg"
                    alt="Abstract background image"
                    width="1080"
                    height="1920"
                    className="h-full w-full object-cover dark:brightness-[0.3]"
                />
            </div>
        </div>
    );
}
