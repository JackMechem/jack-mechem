"use client";

import { useState, useEffect } from "react";
import reactIcon from "../../../assets/icons/react.svg";
import { FiArrowUpRight, FiArrowLeft } from "react-icons/fi";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindCondig from "../../../../tailwind.config.js";
import { PortableText, PortableTextComponent, PortableTextComponents } from "@portabletext/react";

const fullConfig: any = resolveConfig(tailwindCondig);

interface Props {
    thoughts: any;
}

const BodyComponents = {
    types: {
        image: ({ value }: any) => (
            <img
                src={value.url}
                className="lg:h-auto h-[50%] max-w-full md:max-h-[70vh] w-full md:w-auto rounded-[10px] object-cover mb-[20px] my-[20px] md:self-center"
                alt="body image"
            />
        ),
        callToAction: ({ value, isInline }: any) =>
            isInline ? (
                <a href={value.url}>{value.text}</a>
            ) : (
                <div className="callToAction">{value.text}</div>
            ),
    },

    marks: {
        link: ({ children, value }: any) => {
            const rel = !value.href.startsWith("/") ? "noreferrer noopener" : undefined;
            return (
                <a href={value.href} rel={rel}>
                    {children}
                </a>
            );
        },
    },

    block: {
        h3: ({ children }: any) => (
            <h3 className="text-foreground font-bold text-[20px] mb-[10px]">{children}</h3>
        ),
        normal: ({ children }: any) => <p className="mb-[20px]">{children}</p>,
    },
};

const ThoughtContent = ({ thoughts }: Props) => {
    const [menuShown, setMenuShown] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    const [currentProjectIndex, setCurrentProjectIndex] = useState<null | number>(null);

    // ignore error, it exists
    const tailwindMobileSize = fullConfig.theme?.screens?.md;

    console.log(thoughts);
    useEffect(() => {
        const checkForMobile = () => {
            if (window.innerWidth <= tailwindMobileSize.slice(0, -2)) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        };
        checkForMobile();
        window.addEventListener("resize", checkForMobile);
        return () => {
            window.removeEventListener("resize", checkForMobile);
        };
    }, []);

    return (
        <div>
            {menuShown && (
                <div className="bg-secondary fixed top-[60px] bottom-0 md:w-[300px] w-screen border-r border-border/60 z-30 md:drop-shadow-secondary-right overflow-y-scroll overscroll-y-none">
                    <p className="text-[16px] md:font-semibold font-bold leading-normal mt-[10px] md:ml-[18px] ml-[34px] text-foreground">
                        Thoughts
                    </p>

                    {thoughts.map((project: any, index: number) => (
                        <div
                            key={project.slug}
                            className="md:px-0 px-[24px] w-full h-fit flex flex-col items-center cursor-pointer select-none"
                        >
                            <div
                                onClick={() => {
                                    if (currentProjectIndex === index) {
                                        setCurrentProjectIndex(null);
                                    } else {
                                        setCurrentProjectIndex(index);
                                    }
                                    if (isMobile) {
                                        setMenuShown(false);
                                    }
                                }}
                                className="md:w-[278px] w-full h-[60px] mt-[10px] bg-primary rounded-[12px] py-[8px] px-[14px] flex"
                            >
                                <div className="h-full flex flex-col justify-between">
                                    <p className="text-foreground-light text-[16px] font-semibold">
                                        {project.name}
                                    </p>
                                    <p className="text-foreground-light text-[12px] mb-0 justify-end">
                                        {project.date}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {currentProjectIndex !== null ? (
                <div className="bg-primary bg-[radial-gradient(theme(colors.border)_0.25px,transparent_1px)] [background-size:14px_14px] absolute top-[60px] md:left-[300px] left-0 right-0 lg:px-[200px] md:px-[50px] md:py-[75px] px-[24px] pt-[20px] pb-[85px] min-h-[calc(100%-60px)]">
                    {!menuShown && (
                        <div
                            onClick={() => {
                                setMenuShown(true);
                                setCurrentProjectIndex(null);
                            }}
                            className="w-[30px] h-[30px] mb-[10px] rounded-full bg-border/60 text-foreground-light text-[20px] flex items-center justify-center cursor-pointer"
                        >
                            <FiArrowLeft />
                        </div>
                    )}
                    <div className="text-foreground text-[24px] font-bold flex items-center">
                        <span className="mr-[5px]">{thoughts[currentProjectIndex].name}</span>
                    </div>
                    <p className="text-foreground-light text-[15px] font-bold mb-[30px]">
                        {thoughts[currentProjectIndex].date}
                    </p>
                    <div className="w-full h-auto text-foreground-light flex flex-col">
                        <PortableText
                            value={thoughts[currentProjectIndex].body}
                            components={BodyComponents}
                        />

                        {/* 
                        <h3 className="text-foreground font-bold text-[20px] mb-[10px]">
                            Project Summary
                        </h3>
                        <p>
                            Doem Shop is an e-commerce website that I created for my brother Zane
                            Mechem and his partner. The overall layout and design of the site was
                            designed by Zane but some of the other components such as the cart menu
                            were designed by me. <br /> <br />
                            Considering the user base is relatively small, I decided not to go
                            overboard and used a combination of Stripe checkout, Hygraph (formally
                            Graphcms), and Shippo to handle the payments, site content, and shipping
                            labels. I ended up having to use a state management library for the
                            shopping cart so I chose Zustand because who wants to deal with Redux
                            just to set up a shopping cart.
                        </p>
                    */}
                    </div>
                </div>
            ) : (
                <div className="bg-[radial-gradient(theme(colors.border)_0.25px,transparent_1px)] [background-size:14px_14px] absolute top-[60px] md:left-[300px] left-0 right-0 bottom-0 lg:px-[200px] overflow-hidden md:px-[50px] md:py-[75px] px-[24px] py-[20px] flex flex-col items-center">
                    <h3 className="text-foreground-light font-bold opacity-20 text-[20px] mb-[10px]">
                        Select a Thought
                    </h3>
                </div>
            )}
        </div>
    );
};

export default ThoughtContent;
