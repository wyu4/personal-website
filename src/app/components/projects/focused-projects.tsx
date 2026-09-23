import { forwardRef } from "react";
import { PopupDiv } from "../reusable/div-presets";
import PushButton from "../reusable/push-button";
import { IoIosContract, IoIosExit } from "react-icons/io";

const FocusedProjectDiv = forwardRef<
  HTMLDivElement,
  DivAttributes & {
    project: ProjectMetadata;
    onClose: () => void;
  }
>(({ project, onClose, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className="relative w-full flex flex-col justify-start items-center p-5"
    >
      <div className="flex flex-row-reverse justify-start w-full">
        <PushButton
          className="grid place-items-center text-4xl"
          onClick={onClose}
        >
          <IoIosExit className="aspect-square" />
        </PushButton>
      </div>
    </div>
  );
});

export default FocusedProjectDiv;
