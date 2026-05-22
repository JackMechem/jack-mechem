"use client";

import { useEffect, useState } from "react";

const MONTHS = ["Jan","Feb","March","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const NavClock = () => {
	const [timeDate, setTimeDate] = useState<Date | null>(null);

	useEffect(() => {
		setTimeDate(new Date());
		const id = setInterval(() => setTimeDate(new Date()), 1000);
		return () => clearInterval(id);
	}, []);

	if (!timeDate) return null;
	return (
		<>
			<p>{timeDate.getHours() + ":" + timeDate.getMinutes()}</p>
			<p>{timeDate.getDate() + "-" + MONTHS[timeDate.getMonth()] + "-" + timeDate.getFullYear()}</p>
		</>
	);
};

export default NavClock;
