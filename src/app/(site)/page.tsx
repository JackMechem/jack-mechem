import { Pacifico } from "next/font/google";
import indentArrow from "../../assets/arrows/indentArrow.svg";
import toRightArrow from "../../assets/arrows/toRightArrow.svg";
import smallIndentArrow from "../../assets/arrows/smallIndentArrow.svg";
import desktopIcon from "../../assets/icons/desktop-computer.svg";
import reactIcon from "../../assets/icons/react.svg";

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
                    <div className="w-[67px] lg:ml-[127px]">
                        <svg
                            width={67}
                            height={59}
                            viewBox="0 0 70 71"
                            className=" fill-foreground-light w-[67px] h-fit"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M4.49523 1.61962C4.5613 0.793832 3.94542 0.0708418 3.11963 0.00477731C2.29384 -0.0612872 1.57085 0.554591 1.50479 1.38038L4.49523 1.61962ZM1.99999 14L0.504747 13.8804L0.504189 13.8878L1.99999 14ZM19.5 45L19.8764 43.548L19.5 45ZM28 29L28.3436 27.5399L28 29ZM27 49.5L25.9765 50.5966L27 49.5ZM68.9945 61.6229C69.6147 61.0736 69.6721 60.1256 69.1229 59.5054L60.1719 49.3995C59.6226 48.7794 58.6746 48.7219 58.0544 49.2712C57.4343 49.8205 57.3768 50.7685 57.9261 51.3886L65.8825 60.3717L56.8995 68.3281C56.2793 68.8774 56.2219 69.8254 56.7712 70.4455C57.3204 71.0657 58.2684 71.1231 58.8886 70.5739L68.9945 61.6229ZM1.50479 1.38038L0.504766 13.8804L3.49521 14.1196L4.49523 1.61962L1.50479 1.38038ZM0.504189 13.8878C-0.253137 23.9856 0.722036 31.2421 3.83728 36.4568C6.9947 41.742 12.1761 44.6508 19.1235 46.452L19.8764 43.548C13.3239 41.8492 9.00528 39.258 6.41271 34.9182C3.77795 30.5079 2.75313 24.0144 3.49579 14.1122L0.504189 13.8878ZM19.1235 46.452C22.6269 47.3603 25.6716 46.8565 28.0855 45.4548C30.472 44.0691 32.1428 41.865 33.0548 39.5164C33.962 37.18 34.1634 34.5819 33.4576 32.3502C32.7344 30.0635 31.0468 28.1759 28.3436 27.5399L27.6565 30.4601C29.2032 30.8241 30.1511 31.8443 30.5973 33.2549C31.0608 34.7205 30.9655 36.609 30.2582 38.4305C29.5557 40.2397 28.2942 41.8645 26.5791 42.8604C24.8914 43.8404 22.6651 44.271 19.8764 43.548L19.1235 46.452ZM28.3436 27.5399C25.2953 26.8226 22.7529 27.2629 20.9904 28.8842C19.2786 30.459 18.6399 32.8461 18.6681 35.2984C18.7245 40.2004 21.4253 46.3487 25.9765 50.5966L28.0235 48.4034C24.0033 44.6513 21.7138 39.2578 21.6679 35.2639C21.6449 33.2682 22.1771 31.8688 23.0215 31.0921C23.8152 30.3619 25.2144 29.8855 27.6565 30.4601L28.3436 27.5399ZM25.9765 50.5966C30.0165 54.3672 36.4534 56.9413 43.773 58.7081C51.1398 60.4863 59.6101 61.4943 67.9092 61.9973L68.0907 59.0027C59.8898 58.5057 51.6102 57.5137 44.4769 55.7919C37.2966 54.0587 31.4835 51.6328 28.0235 48.4034L25.9765 50.5966Z" />
                        </svg>
                    </div>
                    <div className="mt-[37px] ml-[15px]">
                        <p className="lg:w-[60%] md:w-[80%] sm:w-[100%] text-foreground text-[20px] font-semibold leading-normal h-fit">
                            I&apos;m a react website developer and jazz drummer living in Las Vegas.
                            I enjoy building everything from personal to small business to e
                            commerce websites.
                        </p>
                        <div className="text-accent font-semibold text-[20px] mt-[15px] cursor-pointer">
                            <a href="mailto:mechemjack@gmail.com">
                                <span>Let&apos;s Colaborate</span>
                                <span>
                                    <svg
                                        width="86"
                                        height="16"
                                        viewBox="0 0 86 16"
                                        className="inline-block ml-[12px] fill-accent"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M1 7C0.447715 7 0 7.44772 0 8C0 8.55228 0.447715 9 1 9V7ZM85.7071 8.70711C86.0976 8.31658 86.0976 7.68342 85.7071 7.29289L79.3431 0.928932C78.9526 0.538408 78.3195 0.538408 77.9289 0.928932C77.5384 1.31946 77.5384 1.95262 77.9289 2.34315L83.5858 8L77.9289 13.6569C77.5384 14.0474 77.5384 14.6805 77.9289 15.0711C78.3195 15.4616 78.9526 15.4616 79.3431 15.0711L85.7071 8.70711ZM1 9H85V7H1V9Z" />
                                    </svg>
                                </span>
                            </a>
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
                    <div className="w-[67px] mr-[17px]">
                        <svg
                            width="67"
                            height="59"
                            viewBox="0 0 70 72"
                            className="ml-2 fill-foreground-light w-[67px] h-[59px]"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M4.7351 2.11962C4.80116 1.29383 4.18529 0.570842 3.3595 0.504777C2.53371 0.438713 1.81072 1.05459 1.74465 1.88038L4.7351 2.11962ZM2.23986 14.5L0.744615 14.3804L0.744057 14.3878L2.23986 14.5ZM19.7399 45.5L20.1163 44.048L19.7399 45.5ZM28.2399 29.5L28.5834 28.0399L28.2399 29.5ZM27.2399 50L26.2164 51.0966L27.2399 50ZM69.2344 62.1229C69.8545 61.5736 69.912 60.6256 69.3627 60.0054L60.4118 49.8995C59.8625 49.2794 58.9145 49.2219 58.2943 49.7712C57.6742 50.3205 57.6167 51.2685 58.166 51.8886L66.1224 60.8717L57.1394 68.8281C56.5192 69.3774 56.4617 70.3254 57.011 70.9455C57.5603 71.5657 58.5083 71.6231 59.1285 71.0739L69.2344 62.1229ZM1.74465 1.88038L0.744634 14.3804L3.73508 14.6196L4.7351 2.11962L1.74465 1.88038ZM0.744057 14.3878C-0.0132692 24.4856 0.961904 31.7421 4.07715 36.9568C7.23457 42.242 12.416 45.1508 19.3634 46.952L20.1163 44.048C13.5637 42.3492 9.24515 39.758 6.65257 35.4182C4.01782 31.0079 2.99299 24.5144 3.73566 14.6122L0.744057 14.3878ZM19.3634 46.952C22.8667 47.8603 25.9114 47.3565 28.3254 45.9548C30.7119 44.5691 32.3826 42.365 33.2946 40.0164C34.2019 37.68 34.4033 35.0819 33.6975 32.8502C32.9742 30.5635 31.2867 28.6759 28.5834 28.0399L27.8963 30.9601C29.4431 31.3241 30.391 32.3443 30.8371 33.7549C31.3007 35.2205 31.2053 37.109 30.4981 38.9305C29.7955 40.7397 28.5341 42.3645 26.8189 43.3604C25.1313 44.3404 22.905 44.771 20.1163 44.048L19.3634 46.952ZM28.5834 28.0399C25.5352 27.3226 22.9927 27.7629 21.2303 29.3842C19.5184 30.959 18.8798 33.3461 18.908 35.7984C18.9643 40.7004 21.6651 46.8487 26.2164 51.0966L28.2633 48.9034C24.2432 45.1513 21.9537 39.7578 21.9078 35.7639C21.8848 33.7682 22.417 32.3688 23.2614 31.5921C24.0551 30.8619 25.4542 30.3855 27.8963 30.9601L28.5834 28.0399ZM26.2164 51.0966C30.2563 54.8672 36.6932 57.4413 44.0129 59.2081C51.3797 60.9863 59.85 61.9943 68.1491 62.4973L68.3306 59.5027C60.1297 59.0057 51.85 58.0137 44.7168 56.2919C37.5364 54.5587 31.7234 52.1328 28.2633 48.9034L26.2164 51.0966Z" />
                        </svg>
                    </div>
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
                <div className="w-full h-auto flex flex-col gap-[20%] gap-y-[20px] md:flex-col lg:flex-row md:px-[106px] lg:justify-center items-center">
                    <div className="p-[30px] md:min-w-[403px] md:max-w-[400px] w-auto max-w-[403px] h-[520px] bg-secondary border-border/60 border rounded-[15px] drop-shadow-secondary-lg text-foreground flex flex-col items-center">
                        <img src={desktopIcon.src} className="w-fit h-fit mb-[30px]" />
                        <h3 className="text-foreground-light text-[22px] font-semibold leading-[0.75] mb-[20px] text-center">
                            Design
                        </h3>
                        <p className="text-foreground text-center leading-snug text-[16px] mb-[50px]">
                            I value simple content structure, clean design, and creative
                            interactions.
                        </p>
                        <h3 className="text-foreground-light text-center text-[20px] font-medium leading-[0.75] mb-[15px]">
                            Things I like designing:
                        </h3>
                        <p className="text-foreground text-center leading-snug text-[16px] mb-[30px]">
                            UX, UI, Web
                        </p>
                        <h3 className="text-foreground-light text-center text-[20px] font-medium leading-[0.75] mb-[15px]">
                            Tools I use:
                        </h3>
                        <p className="text-foreground text-center leading-snug text-[16px] mb-[30px]">
                            Affinity <br /> Figma <br /> Pen & Paper <br /> Font Awesome <br />
                            React Icons
                        </p>
                    </div>
                    <div className="p-[30px] md:min-w-[403px] md:max-w-[400px] w-auto max-w-[403px] h-[520px] bg-secondary border-border/60 border rounded-[15px] drop-shadow-secondary-lg text-foreground flex flex-col items-center">
                        <img src={reactIcon.src} className="w-fit h-fit mb-[30px]" />
                        <h3 className="text-foreground-light text-[22px] font-semibold leading-[0.75] mb-[20px] text-center">
                            Web Development
                        </h3>
                        <p className="text-foreground text-center leading-snug text-[16px] mb-[50px]">
                            I like to code things from the ground up, bringing creative ideas to
                            life in the browser.
                        </p>
                        <h3 className="text-foreground-light text-center text-[20px] font-medium leading-[0.75] mb-[15px]">
                            Languages I speak:
                        </h3>
                        <p className="text-foreground text-center leading-snug text-[16px] mb-[30px]">
                            React, Next.js, HTML, CSS, Git
                        </p>
                        <h3 className="text-foreground-light text-center text-[20px] font-medium leading-[0.75] mb-[15px]">
                            Tools I use:
                        </h3>
                        <p className="text-foreground text-center leading-snug text-[16px] mb-[30px]">
                            Neovim <br /> GitHub <br /> Tailwind CSS <br /> Arch Linux <br />
                            Terminal <br /> Vercel
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
