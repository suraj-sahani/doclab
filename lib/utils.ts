import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateRandomColor = (ch: string) => {
  let hash = 0;

  for (let i = 0; i < ch.length; i++) {
    hash = ch.charCodeAt(i) + ((hash << 5) - hash);
  }

  const c = (hash & "0x00ffffff").toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
};
