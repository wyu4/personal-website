import { forwardRef } from "react";
import { InsetDiv, MarkdownDiv } from "../reusable/div-presets";
import PushButton from "../reusable/push-button";
import {
  IoIosExit,
  IoIosExpand,
  IoIosLink,
  IoLogoGithub,
} from "react-icons/io";
import { ProjectLink } from "./projects";

const FocusedProjectDiv = forwardRef<
  HTMLDivElement,
  DivAttributes & {
    project: ProjectMetadata;
    createDate: String;
    onClose: () => void;
  }
>(({ project, onClose, createDate, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className="relative w-full h-full min-h-0 flex flex-col justify-start items-center p-5 gap-5"
    >
      <div className="flex flex-row-reverse justify-start w-full">
        <PushButton
          className="grid place-items-center text-4xl"
          onClick={onClose}
        >
          <IoIosExit className="aspect-square" />
        </PushButton>
      </div>
      <div className="flex flex-col justify-center items-start gap-3">
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-center">
          {project.name}
        </h2>
        <p className="text-sm">
          <i>~ {createDate}</i>
        </p>
      </div>
      <div className="relative px-5 md:px-20 flex flex-col flex-1 justify-start items-start min-h-0 overflow-y-scroll">
        <div className="sticky z-15 top-0 h-30 -mb-10 shrink-0 w-full left-0 bg-linear-to-b from-(--gray-100) to-(--gray-100)/0" />
        <MarkdownDiv
          className="relative text-sm sm:text-xl text-wrap mb-30"
          text={project.description}
        />
        <div className="sticky z-15 bottom-0 h-30 -mt-10 shrink-0 w-full left-0 bg-linear-to-t from-(--gray-100) to-(--gray-100)/0" />
      </div>
      <InsetDiv className="relative flex flex-col items-center justify-center gap-3 p-3 rounded-sm">
        <div className="relative flex flex-row gap-3 justify-center items-center">
          <ProjectLink href={project.demo}>
            <IoIosLink />
          </ProjectLink>
          <ProjectLink href={project.repo}>
            <IoLogoGithub />
          </ProjectLink>
        </div>
      </InsetDiv>
    </div>
  );
});

export default FocusedProjectDiv;
