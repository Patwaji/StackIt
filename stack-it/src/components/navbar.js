"use client";

import { Search, User, LogOut, Bell, Menu } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ModeToggle } from "./theme/theme-toggle";
import { toast } from "sonner";
import { useUserStore } from "@/stores/userStores";
import { notificationUrl } from "@/lib/API";
import { formatDistanceToNow } from "date-fns";

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const { user, isLoggedIn, fetchUser, clearUser } = useUserStore();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchUser(token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    clearUser();
    router.refresh();
    toast.success("Logged out successfully");
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await axios.get(notificationUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  S
                </span>
              </div>
              <span className="font-bold text-xl hidden sm:block">
                Stack It
              </span>
            </Link>

            <div className="hidden lg:flex items-center space-x-6 ml-8">
              <Link href="/" className="text-sm font-medium hover:text-primary">
                Home
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="hidden sm:block">
              <ModeToggle />
            </div>

            {isLoggedIn ? (
              <>
                <DropdownMenu
                  onOpenChange={(open) => open && fetchNotifications()}
                >
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Bell className="h-5 w-5" />
                      <span className="sr-only">Notifications</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-80 max-h-96 overflow-y-auto"
                  >
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {notifications.length === 0 ? (
                      <DropdownMenuItem className="text-muted-foreground">
                        No new notifications
                      </DropdownMenuItem>
                    ) : (
                      notifications.map((notif) => (
                        <DropdownMenuItem
                          key={notif._id}
                          className="flex flex-col items-start"
                        >
                          <div className="text-sm font-medium">
                            {notif.text}
                          </div>
                          {notif.question?.title && (
                            <div className="text-xs text-muted-foreground italic">
                              “{notif.question.title}”
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notif.createdAt), {
                              addSuffix: true,
                            })}
                          </div>
                        </DropdownMenuItem>
                      ))
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link
                        href="/notifications"
                        className="w-full text-center"
                      >
                        View All
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                        <AvatarImage
                          src={
                            user?.avatar ||
                            "/placeholder.svg?height=40&width=40"
                          }
                          alt="Profile"
                        />
                        <AvatarFallback>
                          <User className="h-4 w-4 sm:h-5 sm:w-5" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.name || "Anonymous"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email || "unknown@example.com"}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="sm:hidden"
                      onClick={() =>
                        setTheme(theme === "light" ? "dark" : "light")
                      }
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>Theme</span>
                        <span className="text-xs text-muted-foreground">
                          {theme === "light" ? "🌙" : "☀️"}
                        </span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/screens/login">Login</Link>
                </Button>
                <Button asChild variant="secondary" size="sm">
                  <Link href="/screens/register">Sign Up</Link>
                </Button>
              </>
            )}

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Stack It</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-4 px-5">
                  <Link
                    href="/"
                    className="text-lg font-medium hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {isSearchOpen && (
          <div className="md:hidden pb-4 pt-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10 pr-4"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
