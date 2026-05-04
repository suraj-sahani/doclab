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
  const color = generateRandomColor(userInfo?.email || "1");
  if (!cursorPosition) return null;

  const { x, y } = cursorPosition;
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
        width="64"
        height="64"
        viewBox="0 0 24.00 24.00"
        xmlns="http://www.w3.org/2000/svg"
        stroke={color}
        fill={color}
        className={`size-8 text-[${color}] transform -rotate-[30deg] -translate-x-[12px] -translate-y-[10px] stroke-[${color}]`}
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke="#CCCCCC"
          stroke-width="0.144"
        ></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <path
            opacity="0.1"
            d="M7.236 14.1235L10.1904 7.84548C10.9109 6.31427 13.0891 6.31427 13.8096 7.84548L16.764 14.1235C17.6393 15.9835 15.4758 17.7954 13.7983 16.6071L13.156 16.1522C12.4634 15.6616 11.5366 15.6616 10.844 16.1522L10.2017 16.6072C8.52417 17.7954 6.36069 15.9835 7.236 14.1235Z"
            fill="#323232"
          ></path>{" "}
          <path
            d="M7.236 14.1235L10.1904 7.84548C10.9109 6.31427 13.0891 6.31427 13.8096 7.84548L16.764 14.1235C17.6393 15.9835 15.4758 17.7954 13.7983 16.6071L13.156 16.1522C12.4634 15.6616 11.5366 15.6616 10.844 16.1522L10.2017 16.6072C8.52417 17.7954 6.36069 15.9835 7.236 14.1235Z"
            stroke="#323232"
            stroke-width="1.104"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>{" "}
        </g>
      </svg>
      {/*<svg
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
      </svg>*/}

      <motion.div
        style={{
          backgroundColor: color,
        }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        className="p-2 bg-neutral-200 text-white font-bold whitespace-nowrap text-xs rounded-full min-w-max"
      >
        {userInfo?.name || userInfo?.email || "Unknown user"}
      </motion.div>
    </motion.div>
  );
}
