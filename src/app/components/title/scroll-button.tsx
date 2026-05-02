import { GoChevronDown } from "react-icons/go";
import PushButton from "../reusable/push-button";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { ScrollToPlugin } from "gsap/all";

type ScrollButtonProps = {
  visible?: boolean;
};

gsap.registerPlugin(ScrollToPlugin);

export default function ScrollButton({ visible = true }: ScrollButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  useGSAP(() => {
    gsap.to(buttonRef.current, {
      opacity: visible ? 1 : 0,
      duration: 0.5,
      ease: "power2.inOut",
    });
  }, [visible]);

  return (
    <PushButton
      ref={buttonRef}
      onClick={() => {
        document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
      }}
      className="text-4xl opacity-0"
      disabled={!visible}
    >
      <GoChevronDown />
    </PushButton>
  );
}
