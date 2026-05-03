"use client";
import gsap from "gsap";
import PushButton from "../reusable/push-button";
import { ScrollToPlugin } from "gsap/all";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { CiMail } from "react-icons/ci";
import { FaGithub } from "react-icons/fa";

gsap.registerPlugin(ScrollToPlugin);
export default function TopBar() {
  const container = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > window.innerHeight / 4);
    window.addEventListener("scroll", update);
    window.addEventListener("load", update);
    update();

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("load", update);
    };
  }, []);

  useGSAP(() => {
    gsap.to(container.current, {
      opacity: visible ? 1 : 0,
      duration: 0.5,
      ease: "sine.inOut",
    });
  }, [visible]);

  return (
    <section
      ref={container}
      className="fixed w-full top-0 left-0 z-30 flex flex-row p-5 gap-10 md:gap-5 justify-center md:justify-between bg-linear-180 from-gray-300/75 to-gray-200/75 opacity-0 items-center"
    >
      <div className="flex flex-row justify-center items-center invisible md:visible absolute md:relative">
        <PushButton
          onClick={() =>
            gsap.to(window, {
              scrollTo: 0,
              duration: 1,
              ease: "power2.inOut",
            })
          }
          disabled={!visible}
        >
          <b>Wilson Yu</b>
        </PushButton>
      </div>
      <div className="flex flex-row justify-center items-center gap-[inherit]">
        <PushButton
          className=" text-4xl md:text-2xl"
          disabled={!visible}
          onClick={() => window.open("mailto:wilsonyu657@gmail.com")}
        >
          <CiMail />
        </PushButton>
        <PushButton
          className="text-4xl md:text-2xl"
          disabled={!visible}
          onClick={() => window.open("https://github.com/wyu4", "_blank")}
        >
          <FaGithub />
        </PushButton>
      </div>
    </section>
  );
}
