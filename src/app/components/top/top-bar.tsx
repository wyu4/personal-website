"use client";
import gsap from "gsap";
import PushButton, { PushAnchor } from "../reusable/push-button";
import { ScrollToPlugin } from "gsap/all";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { CiMail } from "react-icons/ci";
import { FaGithub } from "react-icons/fa";
import Contacts from "../reusable/contacts";

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
      className="fixed w-full top-0 left-0 z-30 flex flex-row p-5 gap-10 md:gap-5 justify-center md:justify-between bg-nav opacity-0 items-center"
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
        <Contacts className="text-4xl md:text-2xl" disabled={!visible} />
      </div>
    </section>
  );
}
