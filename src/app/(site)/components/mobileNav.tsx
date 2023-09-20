"use client";

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
import Link from "next/link";

const MobileNav = () => {
    const pathname = usePathname();
    return (
        <div className="md:hidden fixed w-full bg-primary border-t border-border rounded-t-[30px] shadow-[rgba(234,240,239,0.5)_0_-4px_6px_3px] py-[8px] px-[15px] bottom-0 flex flex-row justify-evenly right-0 z-50">
            {pathname === "/" ? (
                <div className="text-accent text-[30px] flex flex-col items-center min-w-[50px]">
                    <AiFillHome />
                    <div className="text-[12px] font-semibold">Home</div>
                </div>
            ) : (
                <Link href={"/"}>
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
                <Link href={"/projects"}>
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
                <Link href={"/thoughts"}>
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
                <Link href={"/music"}>
                    <div className="text-foreground-light text-[30px] flex flex-col items-center min-w-[50px]">
                        <AiOutlineSound />
                        <div className="text-[12px] font-semibold">Music</div>
                    </div>
                </Link>
            )}
        </div>
    );
};

export default MobileNav;
