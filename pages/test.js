import React, { useState } from "react";
import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdCancel } from "react-icons/md";
import MyBookings from "@/pages/mybookings";
import {signOut} from "next-auth/react";

export default function Nav () {
    const [hamburger, setHamburger] = useState(false);
    return (
        <div className='h-[10vh] flex items-center justify-between px-[20px] sticky top-0'>
            <Link href='/'>
                <h1 className='text-xl font-bold text-gray-300'>
                    Cyberjaya Community Toastmasters Club
                </h1>
            </Link>
            <div className='md:flex items-center justify-between hidden space-x-8'>
                <MyBookings  />
                <h1 onClick={() => signOut()}
                    className='text-xl font-bold text-gray-300'>
                    Log out
                </h1>
            </div>
            <div className='md:hidden block'>
                <GiHamburgerMenu
                    className='cursor-pointer text-2xl text-gray-400'
                    onClick={() => setHamburger(true)}
                />
            </div>
            {hamburger && (
                <nav className='fixed top-0 right-0 w-1/2 dim h-[100vh] p-6'>
                    <div className='w-full flex items-center justify-end mb-8'>
                        <MdCancel
                            className='text-4xl text-[#C07F00] cursor-pointer hover:text-white'
                            onClick={() => setHamburger(false)}
                        />
                    </div>
                    <div className='flex w-full flex-col space-y-8'>
                        <MyBookings  />
                        <h1 onClick={() => signOut()}
                            className='text-xl font-bold text-gray-300'>
                            Log out
                        </h1>
                    </div>
                </nav>
            )}
        </div>
    );
};
