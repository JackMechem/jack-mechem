"use client";

import {
  IconX,
  IconLink,
  IconArrowsMaximize,
  IconArrowsMinimize,
  //IconArrowsMove,
} from "@tabler/icons-react";
import Markdown from "react-markdown";
import { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../../../tailwind.config.js";

interface FloatingWorkWindowProps {
  work: any;
  className?: string;
  sideBarState: any;
}

const FloatingWorkWindow = ({
  work,
  className,
  sideBarState,
}: FloatingWorkWindowProps) => {
  const fullConfig: any = resolveConfig(tailwindConfig); // Types are all messed up

  const medBreakPointString: string = fullConfig.theme?.screens?.md!;
  const medBreakPointNumber: number = Number(
    medBreakPointString.substring(0, medBreakPointString.length - 2),
  );

  const windowRef = useRef<HTMLDivElement>(null);
  const [maximized, setMaximized] = useState<boolean>(false);
  const [oldTranslate, setOldTranslate] = useState<string | null>(
    "translate(-300px, -350px)", // Starting position
  );

  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [width]);

  useEffect(() => {
    if (window.innerWidth <= medBreakPointNumber) {
      setMaximized(true);
      if (windowRef.current) {
        setOldTranslate(windowRef.current.style.transform);
        windowRef.current.style.transform = `translate(0px, 0px)`;
      }
    }
  }, [width]);

  return (
    <Draggable
      handle="#handle"
      defaultPosition={{ x: -300, y: -350 }}
      disabled={maximized}
      nodeRef={windowRef}
    >
      <div
        className={
          `fixed transition-none overflow-y-scroll z-[100] hover:z-[110] py-[20px] pt-[40px] bg-primary border-2 border-green rounded-[10px] drop-shadow-bluexlr ` +
          (maximized
            ? "z-[999] top-[20px] bottom-[20px] left-[20px] right-[20px] pt-[0px] pb-[0px] drop-shadow-none "
            : `w-[600px] h-[700px] top-1/2 left-1/2 `) +
          className
        }
        ref={windowRef}
      >
        <div className="absolute top-0 h-[40px] left-0 right-0 flex flex-row justify-between items-center px-[10px] bg-secondary border-b-2 border-b-green">
          <div
            className="cursor-pointer"
            onClick={() => {
              sideBarState.setIsComponentVisible(false);
            }}
          >
            <IconX />
          </div>
          <div
            className={`md:cursor-move text-[16px] font-bold transition-none w-full h-full flex justify-center items-center`}
            id={"handle"}
          >
            {work.title}
          </div>

          {maximized ? (
            <div
              className="cursor-pointer md:block hidden"
              onClick={() => {
                setMaximized(false);
                if (windowRef.current && oldTranslate) {
                  windowRef.current.style.transform = oldTranslate;
                }
              }}
            >
              <IconArrowsMinimize />
            </div>
          ) : (
            <div
              className="cursor-pointer"
              onClick={() => {
                setMaximized(true);
                if (windowRef.current) {
                  setOldTranslate(windowRef.current.style.transform);
                  windowRef.current.style.transform = `translate(0px, 0px)`;
                }
              }}
            >
              <IconArrowsMaximize />
            </div>
          )}
        </div>
        <div
          className={
            (maximized
              ? "md:py-[50px] md:px-[100px] py-[20px] px-[20px]"
              : "py-[10px] px-[50px]") +
            " " +
            "overflow-y-scroll w-full h-full"
          }
        >
          <a href={work.link}>
            <h3 className="text-blue flex items-center gap-3 mb-[20px]">
              {work.title} <IconLink />
            </h3>
          </a>
          <a href={work.link}>
            <img
              src={work.photo.url}
              alt={"work photo"}
              className={
                (maximized ? "h-auto " : "md:h-[200px] ") +
                "w-full rounded-[20px] mb-[10px] object-cover hover:drop-shadow-bluexlr hover:scale-[1.01] hover:cursor-pointer"
              }
            />
          </a>
          <Markdown
            components={{
              img(props) {
                const { node, ...rest } = props;
                return (
                  <img
                    className="rounded-[15px] my-[20px]"
                    alt="project image"
                    {...rest}
                  />
                );
              },
            }}
          >
            {work.longDescription}
          </Markdown>
        </div>
      </div>
    </Draggable>
  );
};

export default FloatingWorkWindow;
