import { sanityFetch } from "@/utils/sanity/client";
import { SanityDocument } from "next-sanity";
import { thoughtsQuery } from "../../../../sanity/queries";
import ThoughtContent from "./thoughtContent";

const Thoughts = async () => {
    // const thoughts = await getThoughts();
    const thoughts = await sanityFetch<SanityDocument[]>({ query: thoughtsQuery });
    return (
        <>
            <ThoughtContent thoughts={thoughts} />
        </>
    );
};

export default Thoughts;
