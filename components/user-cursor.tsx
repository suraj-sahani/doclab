"use client";
import { generateRandomColor } from "@/lib/utils";
import { motion, AnimatePresence, useMotionValue } from "motion/react";

type Props = {
  userInfo: {
    name: string;
    email: string;
    avatar: string;
  };
  cursorPosition: {
    x: number;
    y: number;
  } | null;
};

export default function UserCursor({ userInfo, cursorPosition }: Props) {
  const { x, y } = cursorPosition;

  const color = generateRandomColor(userInfo.email || "1");
  if (!cursorPosition) return null;

  return (
    <motion.div
      className="size-4 rounded-full absolute z-5-"
      style={{
        top: y,
        left: x,
        pointerEvents: "none",
      }}
      initial={{
        scale: 1,
        opacity: 1,
      }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      exit={{
        scale: 0,
        opacity: 0,
      }}
    >
      <svg
        stroke={color}
        fill={color}
        strokeWidth={"1"}
        viewBox="0 0 16 16"
        className={`size-6 text-[${color}] transform -rotate-[70deg] -translate-x-[12px] -translate-y-[10px] stroke-[${color}]`}
        height={"1em"}
        width={"1em"}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006.916l12.728-5.657a.5.5 0 0 1 .556.103z"></path>
      </svg>

      <motion.div
        style={{
          backgroundColor: color,
        }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
      >
        {userInfo.name || userInfo.email}
      </motion.div>
    </motion.div>
  );
}
