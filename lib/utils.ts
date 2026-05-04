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

  // Convert hash to hex color
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += value.toString(16).padStart(2, "0");
  }

  return color;
};
