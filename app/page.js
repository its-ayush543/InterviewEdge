'use client'
import Link from "next/link";
import { Button } from "/components/ui/button";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  const path = usePathname();
    useEffect(() => {
        console.log(path);
    })
  return (
    <>
      <div className="flex p-4 items-center justify-between bg-blue-100 shadow-sm">
        <Image src={"/logo.jpg"} width={160} height={100} alt="logo" />
        <ul className="hidden md:flex gap-6">
          <Link href={"/dashboard"}>
            <li
              className={`hover:text-primary hover:font-bold transition-all cursor-pointer
          ${path == "/dashboard" && "text-primary font-bold"}`}
            >
              Dashboard
            </li>
          </Link>
          <li
            className={`hover:text-primary hover:font-bold transition-all cursor-pointer
          ${path == "/dashboard/questions" && "text-primary font-bold"}`}
          >
            Questions
          </li>
          <li
            className={`hover:text-primary hover:font-bold transition-all cursor-pointer
          ${path == "/dashboard/upgrade" && "text-primary font-bold"}`}
          >
            Upgrade
          </li>
          <li
            className={`hover:text-primary hover:font-bold transition-all cursor-pointer
          ${path == "/dashboard/how" && "text-primary font-bold"}`}
          >
            How it Works?
          </li>
        </ul>
        <UserButton />
      </div>

      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <main className="text-center mt-16 flex flex-col">
            <h1 className="text-5xl font-bold text-blue-700 mt-8">
              Your Personal AI Interview Coach
            </h1>
            <Image src={'interview-icon.svg'} width={200} height={200} className="ml-[45%] mt-10 mb-10"  ></Image>
            <p className="text-gray-600 text-lg mt-4">

              Double your chances of landing that job offer with our AI-powered
              interview prep
            </p>

            <Link href={"/dashboard"}>
              <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg mt-10">
                Get Started
              </button>
            </Link>



            
          </main>
        </div>
      </div>
    </>
  );
}
