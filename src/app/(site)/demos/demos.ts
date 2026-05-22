export interface Demo {
	id: string;
	title: string;
	description: string;
	category: string;
	url: string;
	workSlug?: string;
}

export const DEMOS: Demo[] = [
	{
		id: "fcr-inc",
		title: "FCR Inc.",
		description: "Production ready car rental platform with complete booking, Stripe payment processing, and staff workflows.",
		category: "Collaborative Projects",
		url: "https://fcr-inc.org/",
		workSlug: "fcr-inc",
	},
];
