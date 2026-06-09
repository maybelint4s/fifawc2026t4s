import { motion } from "motion/react";

interface FloatingMascotProps {
  sizeClassName?: string;
}

export const FloatingMascot = ({ sizeClassName = "w-40 md:w-56" }: FloatingMascotProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.2, ease: [0.32, 0.72, 0, 1] }}
      className="fixed bottom-4 right-4 z-40 pointer-events-none"
    >
      <motion.img
        src="/resources/mascota.gif"
        alt="Mascota Mundial 2026"
        className={`${sizeClassName} h-auto object-contain drop-shadow-2xl`}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
};
