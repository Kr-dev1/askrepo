'use client';

import { motion } from 'framer-motion';

export function LoaderOne() {
  return (
    <motion.div
      className="flex items-center justify-center space-x-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.3 }}
    >
      <motion.span
        className="h-4 w-4 rounded-full bg-white"
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "loop" as const,
          delay: 0.1,
          ease: "easeInOut"
        }}
      />
      <motion.span
        className="h-4 w-4 rounded-full bg-white"
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "loop" as const,
          delay: 0.2,
          ease: "easeInOut"
        }}
      />
      <motion.span
        className="h-4 w-4 rounded-full bg-white"
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "loop" as const,
          delay: 0.3,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
}

export function LoaderTwo() {
  return (
    <motion.div
      className="h-5 w-5 rounded-full border-2 border-neutral-500 border-t-transparent animate-spin"
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        duration: 1,
        ease: "linear"
      }}
    />
  );
}

export function LoaderThree() {
  return (
    <motion.div
      className="flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.3 }}
    >
      <motion.div
        className="h-4 w-4 rounded-full bg-white"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "loop" as const,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
}

export function LoaderFour() {
  return (
    <motion.div
      className="flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.3 }}
    >
      <motion.svg
        className="h-5 w-5 text-white animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <motion.circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <motion.path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </motion.svg>
    </motion.div>
  );
}

export function LoaderFive() {
  const dots = "Loading...".split("");

  return (
    <motion.div
      className="flex items-center justify-center gap-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.3 }}
    >
      {dots.map((dot, i) => (
        <motion.span
          key={i}
          className="text-white text-lg font-semibold"
          animate={{ y: [0, -5, 0] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "loop" as const,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
        >
          {dot}
        </motion.span>
      ))}
    </motion.div>
  );
}
