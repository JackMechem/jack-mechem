import { getThoughts } from "../../../../sanity/sanity-utils";
import ThoughtContent from "./thoughtContent";

const Thoughts = async () => {
    const thoughts = await getThoughts();
    return (
        <>
            <ThoughtContent thoughts={thoughts} />
        </>
    );
};

export default Thoughts;
