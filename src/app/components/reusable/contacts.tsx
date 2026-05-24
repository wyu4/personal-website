import { CiMail } from "react-icons/ci";
import { PushAnchor } from "./push-button";
import { FaGithub } from "react-icons/fa";

type ContactsProps = {
  className?: string;
  disabled?: boolean;
};

export default function Contacts({ className = "text-3xl", disabled }: ContactsProps) {
  return (
    <>
      <PushAnchor
        className={className}
        disabled={disabled}
        href="mailto:wilsonyu657@gmail.com"
      >
        <CiMail />
      </PushAnchor>
      <PushAnchor
        className={className}
        disabled={disabled}
        href="https://github.com/wyu4"
      >
        <FaGithub />
      </PushAnchor>
    </>
  );
}
