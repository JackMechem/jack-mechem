import Link from "next/link";

const Music = () => {
    return (
        <div className="absolute top-[60px] bottom-0 bg-[radial-gradient(#B6C3C1_0.25px,transparent_1px)] [background-size:14px_14px] w-screen flex justify-center items-center p-[20px]">
            <div className="bg-secondary border-border/60 border rounded-[15px] drop-shadow-secondary-lg flex flex-col items-center p-6 pb-10 md:w-[300px] w-full">
                <h4 className="text-xl font-bold text-foreground-light mb-6">Work in Progress</h4>
                <p className="text-center text-foreground text-base mb-8">
                    <span className="text-lg font-semibold">Hey!</span> <br /> I am currently
                    designing the music page for my site. Be sure to come back here in a few weeks
                    when I finish it!
                </p>
                <Link href={"/"}>
                    <div className="bg-accent py-2 px-4 text-primary rounded-xl border-2 border-[#689cb0] drop-shadow-md font-semibold cursor-pointer active:drop-shadow-xl">
                        Return To Landing Page
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Music;
