import { forwardRef } from "react";
import { MarkdownDiv } from "../reusable/div-presets";
import PushButton from "../reusable/push-button";
import { IoIosExit } from "react-icons/io";

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
      className="relative w-full h-full min-h-0 flex flex-col justify-start items-center p-5 "
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
        <h2 className="text-4xl md:text-5xl text-center">{project.name}</h2>
        <p className="text-sm">
          <i>Updated on {createDate}</i>
        </p>
      </div>
      <div className="relative px-20 flex flex-col flex-1 justify-start items-start min-h-0 overflow-y-scroll">
        <div className="sticky z-15 top-0 h-30 -mb-10 shrink-0 w-full left-0 bg-linear-to-b from-(--gray-100) to-(--gray-100)/0" />
        <MarkdownDiv
          className="relative text-xl text-wrap"
          text={project.description}
        />
      </div>
    </div>
  );
});

export default FocusedProjectDiv;
