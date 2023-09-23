import { PortableTextBlock } from "sanity";

interface IProject {
    name: string;
    date: string;
    slug: string;
    link: string;
    logo: string;
    hero: string;
    body: PortableTextBlock[];
}
