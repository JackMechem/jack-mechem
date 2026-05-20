import MediumBlock from "./components/mediumBlock";
import Command from "./components/command";
import Separator from "./components/separator";
import Container from "./components/container";
import { LandButton } from "./components/Buttons";
import Link from "next/link";
import { getPage } from "../../lib/api";
import Markdown from "react-markdown";
import { Fragment } from "react";
import Image from "next/image";

const Home = async () => {
	const landingPage = await getPage("landing-page");

	return (
		<div className="w-full pb-[100px]">
			{landingPage.blocksCollection.items.map((block) => {
				return (
					<MediumBlock
						key={block.sys.id}
						className="flex lg:flex-row flex-col-reverse items-center mb-[70px] lg:justify-evenly lg:gap-[50px] md:gap-[70px] gap-[20px]"
					>
						{block.columnsCollection?.items.map((col, colIndex: number) => {
							return (
								<Fragment key={col.sys.id}>
									<Container>
										{col.rowsCollection?.items.map((row) => {
											// console.log(
											//   "Block: " +
											//     block.name +
											//     " | Col: " +
											//     col.name +
											//     " | Row: " +
											//     row.__typename,
											// );
											// console.log(row.outline);
											if (row.__typename === "Command") {
												return (
													<Command key={row.command}>{row.command}</Command>
												);
											}

											if (row.__typename === "TitleText") {
												return (
													<h1 key={row.titleText} className="mb-[20px]">
														{row.titleText}
													</h1>
												);
											}

											if (row.__typename === "BodyText") {
												return (
													<div key={row.bodyText} className="mb-[20px]">
														<Markdown>{row.bodyText}</Markdown>
													</div>
												);
											}

											if (row.__typename === "SubText") {
												return (
													<h3 key={row.text} className="mb-[20px]">
														<Markdown
															disallowedElements={["p"]}
															unwrapDisallowed
														>
															{row.text}
														</Markdown>
													</h3>
												);
											}

											if (row.__typename === "Image" && row.outline === true) {
												return (
													<Container
														key={row.image?.url}
														className="flex justify-center"
													>
														<Image
															className="w-[330px] h-[350px] object-cover rounded-[30px] border-[2px] border-green shadow-bluexlrr mb-[50px]"
															src={row.image!.url}
															alt=""
															width={row.image!.width}
															height={row.image!.height}
															priority
														/>
													</Container>
												);
											} else if (
												row.__typename === "Image" &&
												row.outline === false
											) {
												return (
													<Container
														key={row.image?.url}
														className="flex justify-center mb-[20px]"
													>
														<Image
															className="lg:w-full md:w-[50vw] w-full object-cover border-2 border-secondary rounded-[30px] shadow-2xl shadow-secondary"
															src={row.image!.url}
															alt=""
															width={row.image!.width}
															height={row.image!.height}
														/>
													</Container>
												);
											}

											if (row.__typename === "Button") {
												return (
													<Link href={row.href!} key={row.buttonText}>
														<LandButton>{row.buttonText}</LandButton>
													</Link>
												);
											}
										})}
									</Container>
									{block.separators &&
										colIndex + 1 !== block.columnsCollection?.items.length && (
											<Separator className="lg:flex hidden" />
										)}
								</Fragment>
							);
						})}
					</MediumBlock>
				);
			})}
		</div>
	);
};

export default Home;
