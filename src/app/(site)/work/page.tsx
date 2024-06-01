import { getAllWorks } from "@/lib/api";
import MediumBlock from "../components/mediumBlock";
import WorkEntry from "./workEntry";
import Container from "../components/container";
import Command from "../components/command";

const Work = async () => {
  const works: any = await getAllWorks();
  console.log(works.workCollection.items);
  return (
    <Container>
      <MediumBlock className="">
        <Command>{"./my-work"}</Command>
        <h1 className="mb-[20px]">My Work</h1>
        <h3>
          This is a collection and archive of my favorite works over the years.
          I am constantly making additions and changes to this page so be sure
          to check in every once and a while!
        </h3>
      </MediumBlock>
      <MediumBlock
        className="grid lg:grid-cols-2 grid-cols-1 gap-[50px] lg:max-w-[1500px] pb-[50px]"
        parentClassName="lg:px-[25px]"
      >
        {works.workCollection.items.map((work: any, index: number) => {
          return <WorkEntry key={index} work={work} />;
        })}
      </MediumBlock>
    </Container>
  );
};

export default Work;