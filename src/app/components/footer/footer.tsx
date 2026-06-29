import Contacts from "../reusable/contacts";
import { PushAnchor } from "../reusable/push-button";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <section className="relative px-5 py-10 gap-5 border-t border-(--gray-400) flex flex-col justify-center items-center">
      <div className="flex flex-row justify-center items-center gap-[inherit]">
        <Contacts />
      </div>

      <p className="text-xs sm:text-sm">{`© Copyright ${year} - Wilson Yu`}</p>
      <div className="w-full flex flex-row justify-center md:justify-end items-center gap-[inherit] text-sm md:text-xl -mb-10">
        <p>Archived:</p>
        <PushAnchor target="_blank" href="https://v3.wyu.app/">
          v3
        </PushAnchor>
        <PushAnchor target="_blank" href="https://v2.wyu.app/">
          v2
        </PushAnchor>
        {/* <PushAnchor target="_blank" href="https://v1.wyu.app/">
          v1
        </PushAnchor> */}
      </div>
    </section>
  );
}
