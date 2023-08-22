import reactIcon from "../../../assets/icons/react.svg";
import { FiArrowUpRight } from "react-icons/fi";

const Projects = () => {
    return (
        <div>
            <div className="bg-secondary fixed top-[60px] bottom-0 w-[300px] border-r border-border/60 z-20 drop-shadow-secondary-right">
                <p className="text-[16px] font-semibold leading-normal mt-[10px] ml-[18px] text-foreground">
                    Projects
                </p>
                <div className="w-full h-fit flex flex-col items-center cursor-pointer select-none">
                    <div className="w-[278px] h-[60px] mt-[10px] bg-primary rounded-[8px] py-[8px] px-[12px] flex">
                        <img src={reactIcon.src} className="w-[30px] h-[30px] self-center" />
                        <div className="h-full flex flex-col justify-between pl-[15px]">
                            <p className="text-foreground-light text-[16px] font-semibold">
                                Doem Shop
                            </p>
                            <p className="text-foreground-light text-[12px] mb-0 justify-end">
                                August, 2023
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-primary absolute top-[60px] left-[300px] right-0 lg:px-[200px] px-[50px] py-[75px]">
                <a
                    className="text-foreground text-[24px] font-bold flex items-center cursor-pointer"
                    href="https://doemshop.com"
                >
                    <span className="mr-[5px]">Doem Shop</span>
                    <span>
                        <FiArrowUpRight />
                    </span>
                </a>
                <p className="text-foreground-light text-[15px] font-bold mb-[30px]">
                    August, 2023
                </p>
                <img
                    src="https://wallpapercave.com/wp/wp3236572.jpg"
                    className="lg:h-auto h-[50%] w-full rounded-[10px] object-cover mb-[20px]"
                />
                <div className="w-full h-auto text-foreground-light">
                    <h3 className="text-foreground font-bold text-[20px] mb-[10px]">
                        Project Summary
                    </h3>
                    <p>
                        Doem Shop is an e-commerce website that I created for my brother Zane Mechem
                        and his partner. The overall layout and design of the site was designed by
                        Zane but some of the other components such as the cart menu were designed by
                        me. <br /> <br />
                        Considering the user base is relatively small, I decided not to go overboard
                        and used a combination of Stripe checkout, Hygraph (formally Graphcms), and
                        Shippo to handle the payments, site content, and shipping labels. I ended up
                        having to use a state management library for the shopping cart so I chose
                        Zustand because who wants to deal with Redux just to set up a shopping cart.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Projects;
