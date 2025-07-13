"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { signUpUrl, verifyOtpUrl } from "@/lib/API";
import { toast } from "sonner";
import { useUserStore } from "@/stores/userStores";

export default function RegisterPage() {
  const router = useRouter();
  const { fetchUser } = useUserStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.fullName,
      email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    };

    try {
      await axios.post(signUpUrl, payload);
      setIsDialogOpen(true);
    } catch (error) {
      alert(error?.response?.data?.message || "Signup failed");
    }
  };

  const handleOtpComplete = async (value) => {
    try {
      const res = await axios.post(verifyOtpUrl, { email, otp: value });
      localStorage.setItem("token", res.data.token);
      setIsDialogOpen(false);
      toast.success("Register Successfull 🥳");
      fetchUser();
      router.push("/");
    } catch (error) {
      alert(error?.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <>
      <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
        <div className="hidden bg-muted lg:block">
          <Image
            src="/background.jpg"
            alt="Background"
            width="1080"
            height="1920"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Create an account</h1>
              <p className="text-muted-foreground">
                Enter your information to create an account
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input
                  id="full-name"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder="Max Robinson"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Create account
              </Button>
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
                {Array.from({ length: 6 }).map((_, i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
