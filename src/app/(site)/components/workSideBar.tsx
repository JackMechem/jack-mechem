import { IconX, IconLink } from "@tabler/icons-react";
import Markdown from "react-markdown";

interface WorkSideBarProps {
  work: any;
  className?: string;
  sideBarState: any;
}

const WorkSideBar = ({ work, className, sideBarState }: WorkSideBarProps) => {
  return (
    <div
      className={
        "fixed overflow-y-scroll z-[100] py-[20px] lg:max-w-[500px] md:w-auto w-full lg:right-[20px] right-0 left-auto lg:top-[20px] top-0 lg:bottom-[49px] bottom-0 bg-primary border-2 border-green drop-shadow-bluexlr " +
        className
      }
      ref={sideBarState.ref}
    >
      <div
        className="cursor-pointer absolute top-[8px] left-[8px]"
        onClick={() => {
          sideBarState.setIsComponentVisible(false);
        }}
      >
        <IconX />
      </div>

      <div className="overflow-y-scroll w-full h-full py-[10px] px-[50px]">
        <a href={work.link}>
          <h3 className="text-blue flex items-center gap-3 mb-[20px]">
            {work.title} <IconLink />
          </h3>
        </a>
        <a href={work.link}>
          <img
            src={work.photo.url}
            alt={"work photo"}
            className="md:h-[200px] w-fit rounded-[20px] mb-[10px] object-cover shadow-2xl shadow-secondary hover:shadow-foreground hover:scale-[1.01] hover:cursor-pointer"
          />
        </a>
        <Markdown
          components={{
            img(props) {
              const { node, ...rest } = props;
              return <img className="rounded-[15px] my-[20px]" {...rest} />;
            },
          }}
        >
          {work.longDescription}
        </Markdown>
      </div>
    </div>
  );
};

export default WorkSideBar;
