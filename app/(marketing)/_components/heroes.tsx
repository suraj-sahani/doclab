import Image from "next/image";

export function Heroes() {
  return (
    <div className="flex flex-col justify-center items-center max-w-5xl">
      <div className="flex items-center">
        <div className="relative size-75 sm:size-87.5 md:size-100">
          <Image
            className="object-contain dark:hidden"
            src="/documents.png"
            alt="Documents"
            fill
          />
          <Image
            className="object-contain hidden dark:block"
            src="/documents-dark.png"
            alt="Documents"
            fill
          />
        </div>
        <div className="relative size-100 hidden md:block">
          <Image
            className="object-contain dark:hidden"
            src="/reading.png"
            alt="Reading"
            fill
          />
          <Image
            className="object-contain hidden dark:block"
            src="/reading-dark.png"
            alt="Reading"
            fill
          />
        </div>
      </div>
    </div>
  );
}
