import { Pacifico } from "next/font/google";
import indentArrow from "../assets/arrows/indentArrow.svg";
import toRightArrow from "../assets/arrows/toRightArrow.svg";
import smallIndentArrow from "../assets/arrows/smallIndentArrow.svg";

const pacifico = Pacifico({ subsets: ["latin"], weight: "400" });

export default function Home() {
    return (
        <div>
            <div className="mt-[60px] ml-[20px] mr-[20px] md:ml-[100px] md:mr-[100px] lg:ml-[100px] lg:mr-[100px]">
                <div
                    className={
                        pacifico.className +
                        " mt-[115px] lg:ml-[105px] md:text-[64px] lg:text-[96px] text-[48px] leading-normal w-auto"
                    }
                >
                    <span className="text-foreground-light">Hello, I&apos;m</span>{" "}
                    <span className="text-accent">Jack</span>
                </div>
                <div className="flex flex-row -mt-[10px]">
                    <img
                        src={indentArrow.src}
                        width={67}
                        height={59}
                        className="lg:ml-[127px] h-fit"
                    />
                    <div className="mt-[37px] ml-[15px]">
                        <p className="lg:w-[60%] md:w-[80%] sm:w-[100%] text-foreground text-[20px] font-semibold leading-normal h-fit">
                            I&apos;m a react website developer and jazz drummer living in Las Vegas.
                            I enjoy building everything from personal to small business to e
                            commerce websites.
                        </p>
                        <div className="text-accent font-semibold text-[20px] mt-[15px] cursor-pointer">
                            <span>Let&apos;s Colaborate</span>
                            <span>
                                <img src={toRightArrow.src} className="inline-block ml-[12px]" />
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-[60px] pl-[20px] pr-[20px] md:pl-[100px] md:pr-[100px] lg:pl-[100px] lg:pr-[100px] py-[40px] bg-secondary shadow-secondary-center">
                <h2
                    className={
                        pacifico.className +
                        " lg:text-[64px] md:text-[48px] text-[40px] text-foreground-light"
                    }
                >
                    About Myself
                </h2>
                <div className="flex flex-row -mt-[10px]">
                    <img
                        src={smallIndentArrow.src}
                        width={67}
                        height={59}
                        className="h-fit ml-2 mr-[17px]"
                    />
                    <p className="lg:w-[80%] md:w-[100%] sm:w-[100%] w-full mt-[38px] text-foreground text-[20px] font-semibold leading-normal h-fit">
                        I&apos;m a 17-year-old aspiring developer passionate about all things
                        technology residing in the city of Las Vegas. What started as a curiosity in
                        technology has evolved into a dedicated journey of immersing myself in the
                        world of web development. I am committed to delivering a seamless and
                        professional experience to each and every client, ensuring their projects
                        are executed with utmost professionalism and attention to detail. While my
                        expertise is mainly in react development, I can really make just about
                        anything as long as I have the time!
                    </p>
                </div>
            </div>

            <div className="pl-[20px] pr-[20px] md:pl-[100px] md:pr-[100px] lg:pl-[100px] lg:pr-[100px] py-[40px]">
                <h2
                    className={
                        pacifico.className +
                        " lg:text-[64px] md:text-[48px] text-[40px] text-foreground-light mb-[40px]"
                    }
                >
                    My Skills
                </h2>
                <div className="w-full flex flex-col md:flex-col lg:flex-row gap-[224px] md:px-[106px] justify-center">
                    <div className="p-[30px] md:min-w-[403px] min-w-full bg-secondary">card 1</div>
                    <div className="p-[30px] md:min-w-[403px] min-w-full bg-secondary">card 2</div>
                </div>
            </div>
        </div>
    );
}
