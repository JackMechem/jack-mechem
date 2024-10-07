import { getAllWorks } from "@/lib/api";
import MediumBlock from "../components/mediumBlock";
import WorkEntry from "./workEntry";
import Container from "../components/container";
import Command from "../components/command";

const Work = async () => {
	const works: any = await getAllWorks();
	// console.log(works.workCollection.items);
	return (
		<Container>
			<MediumBlock
				className="lg:max-w-[1500px] flex flex-col gap-[100px]"
				parentClassName="lg:px-[25px]"
			>
				{works.workCategoryCollection.items.map((workCat: any) => {
					return (
						<Container key={workCat.category} className="">
							<Command className="lowercase">./{workCat.category}</Command>
							<h1 className="mb-[50px]">{workCat.category}</h1>
							<Container
								key={workCat.category}
								className="grid lg:grid-cols-2 grid-cols-1 gap-[50px] pb-[50px]"
							>
								{workCat.worksCollection.items.map(
									(work: any, index: number) => {
										return <WorkEntry key={index} work={work} />;
									},
								)}
							</Container>
						</Container>
					);
				})}
			</MediumBlock>
		</Container>
	);
};

export default Work;
