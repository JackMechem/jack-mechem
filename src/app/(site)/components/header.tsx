"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../../../assets/logos/logo.svg";
import { IconMessageCircle, IconMoon, IconSun } from "@tabler/icons-react";
import { useSetTheme } from "@/stores/useThemeStore";

const Header = () => {
  const setTheme = useSetTheme();
  const pathname = usePathname();
  const condensed = pathname?.startsWith("/work");

  return (
    <div
      className={
        "fixed z-50 md:top-[20px] top-[5px] md:right-[20px] right-[5px] md:left-[20px] left-[5px] px-[20px] flex flex-row justify-between items-center transition-all duration-300 " +
        (condensed ? "py-[8px]" : "py-[20px]")
      }
    >
      <Link href={"/"}>
        <div className="flex flex-row gap-[12px] items-center text-foreground-sec cursor-pointer">
          <img
            src={Logo.src}
            alt="logo"
            className={
              "transition-all duration-300 " +
              (condensed ? "md:max-h-[36px] max-h-[30px]" : "md:max-h-[64px] max-h-[54px]")
            }
          />
          <h4 className={condensed ? "hidden" : "md:block hidden"}>HOME</h4>
        </div>
      </Link>
      <div className="flex flex-row items-center gap-[20px]">
        <Link href={"/contact"}>
          <div className="flex flex-row gap-[15px] items-center text-foreground-sec cursor-pointer">
            <h4 className={condensed ? "hidden" : "md:block hidden"}>HIRE ME</h4>
            <IconMessageCircle
              size={condensed ? 28 : 40}
              stroke={2}
              className="text-blue text-xl transition-all duration-300"
            />
          </div>
        </Link>
        <div className="mr-[8px] text-blue cursor-pointer" onClick={setTheme}>
          <IconMoon className="dark-theme:hidden" />
          <IconSun className="hidden dark-theme:block" />
        </div>
      </div>
    </div>
  );
};

export default Header;
