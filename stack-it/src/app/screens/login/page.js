"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// --- Login Page Component ---
export default function LoginPage() {
    // State to toggle between password and OTP login methods
    const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'

    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Login</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your email below to login to your account
                        </p>
                    </div>
                    <div className="grid gap-4">
                        {/* Email input is always present */}
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>

                        {/* Conditionally render Password or OTP input */}
                        {loginMethod === 'password' ? (
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <button
                                        onClick={() => setLoginMethod('otp')}
                                        className="ml-auto inline-block text-sm underline"
                                    >
                                        Use OTP instead
                                    </button>
                                </div>
                                <Input id="password" type="password" required />
                            </div>
                        ) : (
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="otp">One-Time Password</Label>
                                    <button
                                        onClick={() => setLoginMethod('password')}
                                        className="ml-auto inline-block text-sm underline"
                                    >
                                        Use Password instead
                                    </button>
                                </div>
                                <Input id="otp" type="text" required />
                            </div>
                        )}

                        <Button type="submit" className="w-full">
                            {loginMethod === 'password' ? 'Login' : 'Login with OTP'}
                        </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="#" className="underline">
                            Sign up
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
