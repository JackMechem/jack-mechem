"use client";

import Container from "../components/container";
import { IconLink } from "@tabler/icons-react";
import WorkSideBar from "../components/workSideBar";
import { useState } from "react";
import useComponentVisible from "../components/useComponentVisible";

interface WorkEntryProps {
  work: any;
}

const WorkEntry = ({ work }: WorkEntryProps) => {
  const sidebarState = useComponentVisible(false);

  return (
    <Container key={work.sys.id} className="flex flex-col">
      <WorkSideBar
        work={work}
        sideBarState={sidebarState}
        className={sidebarState.isComponentVisible ? "fixed" : "hidden"}
      />
      <img
        src={work.photo.url}
        alt={"work photo"}
        className="md:h-[400px] h-[300px] w-fit rounded-[30px] mb-[10px] object-cover shadow-2xl shadow-secondary hover:shadow-foreground hover:scale-[1.01] hover:cursor-pointer"
        onClick={() => {
          sidebarState.setIsComponentVisible(true);
        }}
      />
      <a href={work.link}>
        <h3 className="text-blue flex items-center gap-3">
          {work.title} <IconLink />
        </h3>
      </a>
      <p className="font-semibold text-foreground-sec">
        {work.shortDescription}
      </p>
    </Container>
  );
};

export default WorkEntry;
