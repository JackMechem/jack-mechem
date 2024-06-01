import Link from "next/link";
import Logo from "../../../assets/logos/logo.svg";
import { IconMessageCircle } from "@tabler/icons-react";

const Header = () => {
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
      <a href="mailto:jack@jackmechem.dev">
        <div className="flex flex-row gap-[15px] items-center text-foreground-sec cursor-pointer">
          <h4 className="md:block hidden">HIRE ME</h4>
          <IconMessageCircle
            size={40}
            stroke={2}
            className="text-blue text-xl"
          />
        </div>
      </a>
    </div>
  );
};

export default Header;
