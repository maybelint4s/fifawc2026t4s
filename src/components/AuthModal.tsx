import React, { useState } from "react";
import { motion } from "motion/react";
import { X, UserPlus, LogIn, Shield, Globe, Mail, Lock, User } from "lucide-react";
import { signIn, signUp, adminSignIn } from "../services/auth";

interface AuthModalProps {
  onClose: () => void;
}

type AuthMode = "login" | "register" | "admin-login";

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const resetMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!email.trim() || !password.trim()) {
      setError("Correo y contraseña son obligatorios.");
      return;
    }

    setIsLoading(true);

    if (mode === "register") {
      if (!name.trim()) {
        setError("El nombre es obligatorio.");
        setIsLoading(false);
        return;
      }
      const { error: signUpError } = await signUp(email.trim(), password.trim(), name.trim());
      setIsLoading(false);
      if (signUpError) {
        setError(signUpError.message);
      } else {
        setSuccess("Cuenta creada. Revisa tu correo para confirmar el registro.");
        setTimeout(() => {
          setMode("login");
          setSuccess("");
        }, 2500);
      }
    } else if (mode === "admin-login") {
      const { error: adminError } = await adminSignIn(email.trim(), password.trim());
      setIsLoading(false);
      if (adminError) {
        setError(adminError.message);
      } else {
        onClose();
      }
    } else {
      const { error: signInError } = await signIn(email.trim(), password.trim());
      setIsLoading(false);
      if (signInError) {
        setError(signInError.message);
      } else {
        onClose();
      }
    }
  };

  const isAdminMode = mode === "admin-login";

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[70]">
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 16 }}
        transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
        className="bg-[#111936] border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-5">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 border ${isAdminMode
                ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-400"
                : "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
              }`}
          >
            {isAdminMode ? <Shield className="w-6 h-6" /> : <Globe className="w-6 h-6" />}
          </div>
          <h3 className="text-lg font-black text-white">
            {isAdminMode ? "Acceso Administrador" : mode === "login" ? "Bienvenido a la Quiniela" : "Crear cuenta"}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isAdminMode
              ? "Ingresa las credenciales de administrador."
              : mode === "login"
                ? "Inicia sesión para registrar tus predicciones."
                : "Regístrate con tu correo corporativo autorizado."}
          </p>
        </div>

        {/* Mode selector */}
        {!isAdminMode && (
          <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 mb-4">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                resetMessages();
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${mode === "login"
                  ? "bg-emerald-600 text-white"
                  : "text-slate-400 hover:text-white"
                }`}
            >
              <LogIn className="w-3 h-3" /> Entrar
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                resetMessages();
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${mode === "register"
                  ? "bg-emerald-600 text-white"
                  : "text-slate-400 hover:text-white"
                }`}
            >
              <UserPlus className="w-3 h-3" /> Registrarme
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "register" && (
            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1 font-bold tracking-wider">
                Nombre completo
              </label>
              <div className="relative">
                <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    resetMessages();
                  }}
                  placeholder="Juan Pérez"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] text-slate-400 uppercase mb-1 font-bold tracking-wider">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  resetMessages();
                }}
                placeholder="usuario@empresa.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase mb-1 font-bold tracking-wider">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  resetMessages();
                }}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg px-3 py-2"
            >
              {error}
            </motion.p>
          )}

          {success && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 rounded-lg px-3 py-2"
            >
              {success}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 mt-2 ${isAdminMode
                ? "bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800"
                : "bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800"
              }`}
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : mode === "register" ? (
              <UserPlus className="w-4 h-4" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            {isLoading
              ? "Procesando..."
              : mode === "register"
                ? "Crear cuenta"
                : isAdminMode
                  ? "Ingresar como Admin"
                  : "Iniciar sesión"}
          </button>
        </form>

        {/* Admin link */}
        {!isAdminMode && (
          <button
            type="button"
            onClick={() => {
              setMode("admin-login");
              resetMessages();
            }}
            className="mt-4 text-[10px] text-slate-500 hover:text-indigo-400 transition-colors w-full text-center"
          >
            ¿Eres administrador? Ingresa aquí
          </button>
        )}

        {isAdminMode && (
          <button
            type="button"
            onClick={() => {
              setMode("login");
              resetMessages();
            }}
            className="mt-4 text-[10px] text-slate-500 hover:text-emerald-400 transition-colors w-full text-center"
          >
            Volver a inicio de sesión
          </button>
        )}
      </motion.div>
    </div>
  );
};
