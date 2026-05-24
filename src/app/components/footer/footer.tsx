import Contacts from "../reusable/contacts";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <section className="px-5 py-10 gap-5 border-t border-(--gray-400) flex flex-col justify-center items-center">
      <div className="flex flex-row justify-center items-center gap-[inherit]">
        <Contacts />
      </div>
      <p className="text-xs sm:text-sm">{`© Copyright ${year} - Wilson Yu`}</p>
    </section>
  );
}
