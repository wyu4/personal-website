import { CiMail } from "react-icons/ci";
import { PushAnchor } from "../reusable/push-button";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <section className="px-5 py-10 gap-5 border-t border-(--gray-400) flex flex-col justify-center items-center">
      <div className="flex flex-row justify-center items-center gap-[inherit]">
        <PushAnchor className=" text-3xl" href="mailto:wilsonyu657@gmail.com">
          <CiMail />
        </PushAnchor>
        <PushAnchor className="text-3xl" href="https://github.com/wyu4">
          <FaGithub />
        </PushAnchor>
      </div>
      <p className="text-xs sm:text-sm">{`© Copyright ${year} - Wilson Yu`}</p>
    </section>
  );
}
