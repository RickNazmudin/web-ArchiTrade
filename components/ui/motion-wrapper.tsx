"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

export const motionItem = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

interface MotionWrapperProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
}

export function MotionWrapper({ children, delay = 0, ...props }: MotionWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay, 
        ease: [0.21, 0.47, 0.32, 0.98] 
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MotionTableBody({ children, ...props }: HTMLMotionProps<"tbody">) {
  return (
    <motion.tbody
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.05
          }
        }
      }}
      {...props}
    >
      {children}
    </motion.tbody>
  );
}

export function MotionTableRow({ children, ...props }: HTMLMotionProps<"tr">) {
  return (
    <motion.tr
      variants={motionItem}
      {...props}
    >
      {children}
    </motion.tr>
  );
}
