"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Moon, Sun } from "lucide-react";
import { FcCalendar } from "react-icons/fc";
import { FaPlus } from "react-icons/fa6";
import { RxDashboard } from "react-icons/rx";
import { Button } from "./ui/button";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { useDispatch } from "react-redux";
import { mainDialogOpen } from "@/lib/features/ui/uiSlice";
import Link from "next/link";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const { isSignedIn } = useUser();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const today = new Date();
  const [day, month, numberOfDay] = String(today).split(" ");

  return (
    <nav className="flex justify-between items-center bg-muted rounded-lg p-2 mb-1 shadow-xl dark:shadow-[0_0_3px_rgba(255,255,255,0.4)] h-12.5 duration-200">
      <div>
        <Image src={"/logoApp.png"} width={100} height={40} alt="logoApp" />
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <FcCalendar className="w-6 h-6 hidden md:block" />
        {mounted && (
          <div>
            <span className="text-md md:text-2xl font-bold text-[#ffb22b]">{day}/</span>
            <span className="font-bold text-[#00c896]">{numberOfDay}-</span>
            <span className="font-bold text-primary">{month}</span>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-3">
        {isSignedIn && (
          <>
            <Button className="rounded-lg text-forground bg-transparent cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#ffffff29] duration-200">
              <Link href={"/dashboard"}>
                <RxDashboard />
              </Link>
            </Button>
            <Button
              onClick={() => dispatch(mainDialogOpen(true))}
              className="rounded-lg text-forground bg-transparent cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#ffffff29] duration-200"
            >
              <FaPlus />
            </Button>
          </>
        )}
        {mounted && (
          <Button
            className={`rounded-lg text-forground bg-transparent cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#ffffff29] duration-200 ${theme === "light" ? "text-black" : "text-white"}`}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <Moon /> : <Sun />}
          </Button>
        )}
        <div className="flex space-x-3">
          <Show when="signed-out">
            <Button
              asChild
              className="bg-transparent text-black dark:text-white border hover:border-gray-300 duration-200"
            >
              <SignInButton />
            </Button>
            <SignUpButton>
              <Button variant={"outline"}>Sign Up</Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
