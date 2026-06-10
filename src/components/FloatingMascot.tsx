import { motion } from "motion/react";

interface FloatingMascotProps {
  sizeClassName?: string;
  message?: string | null;
}

export const FloatingMascot = ({ sizeClassName = "w-40 md:w-56", message }: FloatingMascotProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.2, ease: [0.32, 0.72, 0, 1] }}
      className="fixed bottom-4 right-4 z-40 pointer-events-none flex items-end gap-2 sm:gap-3"
    >
      {message && (
        <motion.div
          key={message}
          initial={{ opacity: 0, y: 10, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
          className="relative mb-6 max-w-[170px] sm:max-w-[280px] rounded-2xl border border-worldcup-accent/35 bg-slate-950/95 px-3.5 py-3 text-[11px] sm:text-xs font-semibold leading-snug text-slate-100 shadow-2xl shadow-black/30 backdrop-blur-md"
          role="status"
          aria-live="polite"
        >
          <span className="block text-[9px] uppercase tracking-widest text-worldcup-accent mb-1">
            Mascota dice
          </span>
          {message}
          <span className="absolute -right-2 bottom-5 h-4 w-4 rotate-45 border-r border-t border-worldcup-accent/35 bg-slate-950/95" />
        </motion.div>
      )}
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
