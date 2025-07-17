"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { loginUrl, verifyOtpUrl, sendOtpUrl } from "@/lib/API";
import { useUserStore } from "@/stores/userStores";

export default function LoginPage() {
  const router = useRouter();
  const { fetchUser } = useUserStore();

  const [loginMethod, setLoginMethod] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);

  const handleSendOtp = async () => {
    if (!email) return toast.error("Please enter your email first");
    toast.info("Sending Otp...");
    try {
      await axios.post(sendOtpUrl, { email });
      setShowOtpDialog(true);
      setLoginMethod("otp");
      toast.success("OTP sent successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (loginMethod === "password") {
        res = await axios.post(loginUrl, { email, password });
      } else {
        res = await axios.post(verifyOtpUrl, { email, otp });
      }

      localStorage.setItem("token", res.data.token);
      fetchUser(res.data.token);
      toast.success("Login successful!");
      router.push("/");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-between overflow-hidden">
      <div className="flex flex-1 items-center justify-center py-12">
        <form onSubmit={handleSubmit} className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-muted-foreground">
              Enter your email to login to your account
            </p>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {loginMethod === "password" ? (
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="ml-auto text-sm underline"
                  >
                    Use OTP instead
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            ) : null}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? "Processing..."
                : loginMethod === "password"
                ? "Login"
                : "Verify OTP"}
            </Button>
          </div>

          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/screens/register" className="underline">
              Sign up
            </Link>
          </div>
        </form>
      </div>

      {/* Right section for Image */}
      <div className="hidden bg-muted lg:block flex-1 h-full">
        <Image
          src="/background.jpg"
          alt="Login background"
          width={1080}
          height={1920}
          className="h-full w-full object-cover"
        />
      </div>

      {/* OTP Dialog */}
      <Dialog
        open={showOtpDialog}
        onOpenChange={(open) => {
          setShowOtpDialog(open);
          if (!open) {
            setLoginMethod("password");
            setOtp("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter OTP</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We&apos;ve sent a 6-digit OTP to <b>{email}</b>
            </p>
            <InputOTP maxLength={6} value={otp} onChange={(val) => setOtp(val)}>
              <InputOTPGroup>
                {[...Array(6)].map((_, i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>

            <button
              type="button"
              className="text-sm underline"
              onClick={handleSendOtp}
            >
              Resend OTP
            </button>
          </div>
          <DialogFooter>
            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={otp.length !== 6 || loading}
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
