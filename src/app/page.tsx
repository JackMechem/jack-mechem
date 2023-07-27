import Image from "next/image";
import constructionEmoji from "../assets/constructionEmoji.png";

export default function Home() {
    return (
        <main>
            <div className="absolute max-w-md px-10 py-12 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800/30 border border-gray-300 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg opacity-90 bg-opacity-30 items-center flex flex-col">
                <h1 className="text-yellow-300 mb-6 text-2xl font-semibold">
                    Website Under Construction
                </h1>
                <Image
                    src={constructionEmoji.src}
                    width={100}
                    height={100}
                    alt="Construction Emoji"
                    className="h-12 w-auto max-w-sm mb-8"
                />
                <h1 className="text-slate-100 text-3xl font-medium mb-1 tracking-tight">
                    Jack Mechem
                </h1>
                <p className="text-slate-400">Website Comming Soon!</p>
            </div>

            {/* Blur Background */}
            <div
                className="absolute inset-x-0 h-screen w-screen -z-10 transform-gpu overflow-hidden blur-[10em] flex items-start justify-start"
                aria-hidden="true"
            >
                <div
                    className="flex h-3/4 w-[36.125rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
                    style={{
                        clipPath:
                            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                    }}
                />
            </div>
        </main>
    );
}
