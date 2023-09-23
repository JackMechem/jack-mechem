"use client";

import { Pacifico } from "next/font/google";
import Link from "next/link";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import {
    AiOutlineHome,
    AiOutlineProject,
    AiOutlineCloud,
    AiOutlineSound,
    AiFillHome,
    AiFillProject,
    AiFillCloud,
    AiFillSound,
} from "react-icons/ai";
import { usePathname } from "next/navigation";
import { useSetTheme, useTheme } from "@/stores/useThemeStore";
import { BsFillMoonFill, BsSunFill } from "react-icons/bs";

const pacifico = Pacifico({ subsets: ["latin"], weight: "400" });

const Header = () => {
    const pathname = usePathname();
    const [mobileMenuShown, setMobileMenuShown] = useState(false);
    const theme = useTheme();
    const setTheme = useSetTheme();
    return (
        <div className="h-[60px] fixed top-0 left-0 right-0 bg-primary/60 backdrop-blur-md flex flex-row items-center justify-center md:justify-normal lg:justify-normal border-b-[1px] border-b-border/60 drop-shadow-secondary select-none z-50">
            <Link
                href="/"
                className={
                    pacifico.className +
                    " w-fit h-auto md:ml-[100px] text-foreground-light text-[32px] font-normal select-none"
                }
            >
                Jack Mechem
            </Link>
            <div
                onClick={() => {
                    setMobileMenuShown(!mobileMenuShown);
                }}
                className="hidden lg:hidden md:flex absolute right-[20px] p-[6px] shadow-[0_0_4px_2px_theme(colors.border)] rounded-full bg-border/60 text-foreground-light text-[20px] items-center justify-center cursor-pointer"
            >
                <IoIosArrowDown />
            </div>
            {mobileMenuShown && (
                <div className="fixed animate-slideInDown bg-secondary border border-border drop-shadow-secondary rounded-[25px] py-[8px] px-[25px] mt-[10px] mx-[10px] top-[60px] flex flex-row gap-[30px] right-0 z-50">
                    {pathname === "/" ? (
                        <div className="text-accent text-[30px] flex flex-col items-center min-w-[50px]">
                            <AiFillHome />
                            <div className="text-[12px] font-semibold">Home</div>
                        </div>
                    ) : (
                        <Link
                            href={"/"}
                            onClick={() => {
                                setMobileMenuShown(false);
                            }}
                        >
                            <div className="text-foreground-light text-[30px] flex flex-col items-center min-w-[50px]">
                                <AiOutlineHome />
                                <div className="text-[12px] font-semibold">Home</div>
                            </div>
                        </Link>
                    )}
                    {pathname === "/projects" ? (
                        <div className="text-accent text-[30px] flex flex-col items-center min-w-[50px]">
                            <AiFillProject />
                            <div className="text-[12px] font-semibold">Projects</div>
                        </div>
                    ) : (
                        <Link
                            href={"/projects"}
                            onClick={() => {
                                setMobileMenuShown(false);
                            }}
                        >
                            <div className="text-foreground-light text-[30px] flex flex-col items-center min-w-[50px]">
                                <AiOutlineProject />
                                <div className="text-[12px] font-semibold">Projects</div>
                            </div>
                        </Link>
                    )}
                    {pathname === "/thoughts" ? (
                        <div className="text-accent text-[30px] flex flex-col items-center min-w-[50px]">
                            <AiFillCloud />
                            <div className="text-[12px] font-semibold">Thoughts</div>
                        </div>
                    ) : (
                        <Link
                            href={"/thoughts"}
                            onClick={() => {
                                setMobileMenuShown(false);
                            }}
                        >
                            <div className="text-foreground-light text-[30px] flex flex-col items-center min-w-[50px]">
                                <AiOutlineCloud />
                                <div className="text-[12px] font-semibold">Thoughts</div>
                            </div>
                        </Link>
                    )}
                    {pathname === "/music" ? (
                        <div className="text-accent text-[30px] flex flex-col items-center min-w-[50px]">
                            <AiFillSound />
                            <div className="text-[12px] font-semibold">Music</div>
                        </div>
                    ) : (
                        <Link
                            href={"/music"}
                            onClick={() => {
                                setMobileMenuShown(false);
                            }}
                        >
                            <div className="text-foreground-light text-[30px] flex flex-col items-center min-w-[50px]">
                                <AiOutlineSound />
                                <div className="text-[12px] font-semibold">Music</div>
                            </div>
                        </Link>
                    )}
                </div>
            )}
            <div className="text-foreground-light w-auto h-full right-[100px] absolute flex-row items-center gap-[50px] hidden lg:flex">
                <Link href="/" className="font-semibold">
                    Home
                </Link>
                <Link href="/projects" className="font-semibold">
                    Projects
                </Link>
                <Link href="/thoughts" className="font-semibold">
                    Thoughts
                </Link>
                <Link href="/music" className="font-semibold">
                    Music
                </Link>
            </div>
            <div
                onClick={setTheme}
                className="absolute left-[20px] p-[8px] rounded-full bg-foreground-light text-secondary shadow-[theme(colors.accent)_0_0_3px_1px] cursor-pointer"
            >
                {theme.includes("light") ? (
                    <BsFillMoonFill />
                ) : (
                    theme.includes("dark") && <BsSunFill />
                )}
            </div>
        </div>
    );
};

export default Header;
