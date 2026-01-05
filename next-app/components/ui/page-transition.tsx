"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"

const variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  enter: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.98 },
}

interface PageTransitionProps {
  children: React.ReactNode
  mode?: "wait" | "popLayout" | "sync"
}

export function PageTransition({ children, mode = "wait" }: PageTransitionProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode={mode}>
      <motion.div
        key={pathname}
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={variants}
        transition={{
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}