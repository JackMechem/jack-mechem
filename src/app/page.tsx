import Image from "next/image";
import constructionEmoji from "../assets/constructionEmoji.png";
import { BsGithub } from "react-icons/bs";

export default function Home() {
    return (
        <main className="absolute h-screen w-screen bg-black">
            <div className="absolute max-w-md min-w-min px-10 py-12 bg-gray-100 border-neutral-700 bg-neutral-800/30 border left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg opacity-90 bg-opacity-30 items-center flex flex-col shadow-[0_2px_15px_rgba(255,255,255,0.3)]">
                <h1 className="text-yellow-200 mb-6 text-2xl font-semibold text-center">
                    Website Under Construction
                </h1>
                <Image
                    src={constructionEmoji.src}
                    width={100}
                    height={100}
                    alt="Construction Emoji"
                    className="h-12 w-auto max-w-sm mb-8"
                />
                <h1 className="text-slate-200 text-3xl font-medium mb-4 tracking-tight text-center drop-shadow-[0_5px_10px_rgba(255,255,255,0.3)]">
                    Jack Mechem
                </h1>
                <a
                    className="text-blue-400 cursor-pointer leading-5 hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]"
                    href="mailto:mechemjack@gmail.com"
                >
                    mechemjack@gmail.com
                </a>
                <p className="text-slate-400">Website Developer</p>
                <a
                    className="text-gray-200 text-4xl text-center mt-8 cursor-pointer hover:drop-shadow-lg shadow-slate-100"
                    href="https://github.com/JackMechem/jack-mechem"
                >
                    <BsGithub className="hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" />
                </a>
            </div>
        </main>
    );
}
