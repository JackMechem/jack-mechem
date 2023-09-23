import { PortableTextBlock } from "sanity";

export interface IProject {
    name: string;
    date: string;
    slug: string;
    link: string;
    logo: string;
    hero: string;
    body: PortableTextBlock[];
}

export interface ILandingPage {
    slug: string;
    titleText: string;
    titleBio: string;
    aboutTitle: string;
    aboutText: string;
    skillsTitle: string;
}

export interface ISkillCard {
    name: string;
    slug: string;
    description: string;
    logo: string;
    titleOne: string;
    bodyOne: string;
    titleTwo: string;
    bodyTwo: string;
}
