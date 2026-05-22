import NavClock from "./NavClock";
import { NavDesktopLinks, NavMobileLinks } from "./NavLinks";

const Nav = () => {
	return (
		<>
			<div className="z-[999] fixed bottom-[20px] left-[20px] right-[20px] bg-green text-[20px] text-foreground dark-theme:text-primary px-[1px] lg:flex hidden justify-between">
				<p>[website]</p>
				<NavDesktopLinks />
				<div className="flex gap-[12px]">
					<p>&quot;user97&quot;</p>
					<NavClock />
				</div>
			</div>

			<div className="fixed lg:hidden flex justify-center bottom-[30px] left-[20px] right-[20px]">
				<div className="md:text-[16px] text-[14px] bg-secondary rounded-full border-[2px] border-green p-[5px] flex flex-row gap-[0px]">
					<NavMobileLinks />
				</div>
			</div>
		</>
	);
};

export default Nav;
