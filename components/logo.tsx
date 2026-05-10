import Image from "next/image";

export const Logo = () => {
  return (
    <div className="hidden md:flex items-center gap-x-2">
      <Image
        src="/logo.svg"
        height="20"
        width="20"
        alt="Logo"
        className="dark:hidden"
      />
      <Image
        src="/logo-dark.svg"
        height="20"
        width="20"
        alt="Logo"
        className="hidden dark:block"
      />
      <p className={"font-semibold"}>Doclab</p>
    </div>
  );
};
