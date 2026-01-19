import { motion } from "framer-motion";

export default function AnimatedTitle({ text = " " }) {
  const letter = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        type: "spring",
        stiffness: 120,
      },
    }),
  };

  const MotionH1 = motion.h1;
  const MotionSpan = motion.span;

  return (
    <MotionH1
      className="text-4xl font-bold inline-flex text-primary-50"
      initial="hidden"
      animate="visible"
    >
      {text.split("").map((char, i) => (
        <MotionSpan key={i} custom={i} variants={letter}>
          {char === " " ? "\u00A0" : char}
        </MotionSpan>
      ))}
    </MotionH1>
  );
}
