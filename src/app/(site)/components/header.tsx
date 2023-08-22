import { Pacifico } from "next/font/google";
import Link from "next/link";

const pacifico = Pacifico({ subsets: ["latin"], weight: "400" });

const Header = () => {
    return (
        <div className="h-[60px] fixed top-0 left-0 right-0 bg-primary/60 backdrop-blur-md flex flex-row items-center justify-center md:justify-normal lg:justify-normal border-b-[1px] border-b-border/60 drop-shadow-secondary select-none z-10">
            <Link
                href="/"
                className={
                    pacifico.className +
                    " w-fit h-auto md:ml-[100px] text-foreground-light text-[32px] font-normal select-none"
                }
            >
                Jack Mechem
            </Link>
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
        </div>
    );
};

export default Header;