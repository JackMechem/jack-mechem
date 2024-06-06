"use client";

import Link from "next/link";
import Logo from "../../../assets/logos/logo.svg";
import { IconMessageCircle, IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme, useSetTheme } from "@/stores/useThemeStore";

const Header = () => {
  const theme = useTheme();
  const setTheme = useSetTheme();

  return (
    <div className="fixed z-50 md:top-[20px] top-[5px] md:right-[20px] right-[5px] md:left-[20px] left-[5px] px-[20px] py-[20px] flex flex-row justify-between items-center">
      <Link href={"/"}>
        <div className="flex flex-row gap-[15px] items-center text-foreground-sec cursor-pointer">
          <img
            src={Logo.src}
            alt="logo"
            className="md:max-h-[64px] max-h-[54px]"
          />
          <h4 className="md:block hidden">HOME</h4>
        </div>
      </Link>
      <div className="flex flex-row items-center gap-[20px]">
        <Link href={"/contact"}>
          <div className="flex flex-row gap-[15px] items-center text-foreground-sec cursor-pointer">
            <h4 className="md:block hidden">HIRE ME</h4>
            <IconMessageCircle
              size={40}
              stroke={2}
              className="text-blue text-xl"
            />
          </div>
        </Link>
        <div className="mr-[8px] text-blue cursor-pointer" onClick={setTheme}>
          {theme === "light" ? <IconMoon /> : <IconSun />}
        </div>
      </div>
    </div>
  );
};

export default Header;
