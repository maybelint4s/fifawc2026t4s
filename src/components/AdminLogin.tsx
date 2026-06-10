import React, { useState } from "react";
import { motion } from "motion/react";
import { X, Shield, LogIn } from "lucide-react";
import { adminSignIn } from "../services/auth";

interface AdminLoginProps {
  onLogin: () => void;
  onClose: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isAdminEmail = email.trim().toLowerCase() === "admin@admin.com";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isAdminEmail) {
      setError("Este correo no tiene privilegios de administrador.");
      return;
    }

    if (!password.trim()) {
      setError("Introduce la contraseña de administrador.");
      return;
    }

    setIsLoading(true);
    const { error: signInError } = await adminSignIn(email.trim(), password.trim());
    setIsLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    onLogin();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[60]">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
        className="bg-[#111936] border border-slate-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 border border-indigo-500/30">
            <Shield className="w-6 h-6 text-indigo-400" />
          </div>
          <h3 className="text-lg font-black text-white">Acceso Administrador</h3>
          <p className="text-xs text-slate-400 mt-1">
            Ingresa tus credenciales para gestionar la plataforma.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[10px] text-slate-400 uppercase mb-1 font-bold tracking-wider">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="admin@admin.com"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>

          {isAdminEmail && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <label className="block text-[10px] text-slate-400 uppercase mb-1 font-bold tracking-wider">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </motion.div>
          )}

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg px-3 py-2"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            {isLoading ? "Verificando..." : "Ingresar como Administrador"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
