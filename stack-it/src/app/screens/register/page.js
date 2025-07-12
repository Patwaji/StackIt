"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";


// --- Register Page Component ---
export default function RegisterPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleFormSubmit = (event) => {
        event.preventDefault(); // Prevent the default form submission
        // In a real app, you would first validate the form fields
        // and then make an API call to send an OTP to the user's email.
        console.log("Form submitted, opening OTP dialog...");
        setIsDialogOpen(true); // Open the dialog
    };

    const handleOtpComplete = (otp) => {
        // This function is called automatically when the OTP is fully entered.
        console.log("OTP verification submitted with:", otp);
        // In a real app, you would make an API call here to verify the OTP.
        // If successful, you would create the account and redirect the user.
        setIsDialogOpen(false); // Close the dialog on completion
    };

    return (
        <>
            <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
                <div className="hidden bg-muted lg:block">
                    <Image
                        src="/login-background.jpg"
                        alt="Abstract background image"
                        width="1080"
                        height="1920"
                        className="h-full w-full object-cover dark:brightness-[0.3]"
                    />
                </div>
                <div className="flex items-center justify-center py-12">
                    <div className="mx-auto grid w-[350px] gap-6">
                        <div className="grid gap-2 text-center">
                            <h1 className="text-3xl font-bold">Create an account</h1>
                            <p className="text-balance text-muted-foreground">
                                Enter your information to create an account
                            </p>
                        </div>
                        <form onSubmit={handleFormSubmit}>
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
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        required
                                    />
                                </div>
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
                        </form>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <Link href="/screens/login" className="underline">
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Verify your Email</DialogTitle>
                        <DialogDescription>
                            Enter the 6-digit code sent to your email address.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center justify-center space-x-2 py-4">
                        <InputOTP maxLength={6} onComplete={handleOtpComplete}>
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
