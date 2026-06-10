import React, { useState } from "react";
import { motion } from "motion/react";
import { X, Shield, Plus, Trash2, Globe, Save } from "lucide-react";
import {
  useAllowedDomains,
  useAddAllowedDomain,
  useRemoveAllowedDomain,
} from "../hooks/useAllowedDomains";
import { useAuth } from "../hooks/useAuth";

interface AdminPanelProps {
  onLogout: () => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onLogout,
  onClose,
}) => {
  const [newDomain, setNewDomain] = useState("");
  const [error, setError] = useState("");

  const { domains, isLoading: loadingDomains } = useAllowedDomains();
  const addDomain = useAddAllowedDomain();
  const removeDomain = useRemoveAllowedDomain();
  const { user } = useAuth();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = newDomain.trim().toLowerCase();
    if (!trimmed) {
      setError("Introduce un dominio válido.");
      return;
    }

    const normalized = trimmed.startsWith("@") ? trimmed : `@${trimmed}`;

    if (!normalized.includes(".")) {
      setError("El dominio debe contener un punto (ej. @empresa.com).");
      return;
    }

    if (domains.some((d) => d.domain === normalized)) {
      setError("Este dominio ya está en la lista.");
      return;
    }

    try {
      await addDomain(normalized);
      setNewDomain("");
    } catch (err: any) {
      setError(err.message || "Error al agregar el dominio.");
    }
  };

  const handleRemove = async (domain: string) => {
    try {
      await removeDomain(domain);
    } catch (err: any) {
      setError(err.message || "Error al eliminar el dominio.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[60]">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
        className="bg-[#111936] border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 border border-emerald-500/30">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="text-lg font-black text-white">Panel de Administración</h3>
          <p className="text-xs text-slate-400 mt-1">
            Configura los dominios de correo que tendrán acceso a la plataforma.
          </p>
        </div>

        {/* Current admin info */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 mb-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
            <span className="text-sm">👤</span>
          </div>
          <div>
            <p className="text-xs font-bold text-white">{user?.email || "Admin"}</p>
            <p className="text-[10px] text-emerald-400 font-mono uppercase">Sesión activa</p>
          </div>
        </div>

        {/* Add domain form */}
        <form onSubmit={handleAdd} className="mb-4">
          <label className="block text-[10px] text-slate-400 uppercase mb-1.5 font-bold tracking-wider">
            Agregar dominio permitido
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={newDomain}
                onChange={(e) => {
                  setNewDomain(e.target.value);
                  setError("");
                }}
                placeholder="empresa.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-400 mt-2"
            >
              {error}
            </motion.p>
          )}
        </form>

        {/* Domains list */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Dominios autorizados
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {domains.length} total
            </span>
          </div>

          {loadingDomains ? (
            <div className="text-center py-6">
              <span className="inline-block w-5 h-5 border-2 border-slate-600 border-t-emerald-400 rounded-full animate-spin" />
            </div>
          ) : domains.length === 0 ? (
            <div className="text-center py-6 bg-slate-950/40 border border-slate-800/60 rounded-xl">
              <p className="text-xs text-slate-500">No hay dominios configurados.</p>
              <p className="text-[10px] text-slate-600 mt-0.5">Todos los correos podrían ser aceptados.</p>
            </div>
          ) : (
            <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
              {domains.map((domain) => (
                <div
                  key={domain.id}
                  className="flex items-center justify-between bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2"
                >
                  <span className="text-sm text-white font-mono">{domain.domain}</span>
                  <button
                    onClick={() => handleRemove(domain.domain)}
                    className="text-slate-500 hover:text-red-400 transition-colors p-1"
                    title="Eliminar dominio"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2.5">
          <button
            onClick={onLogout}
            className="flex-1 py-2 bg-slate-900 hover:bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 transition-all"
          >
            Cerrar sesión
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            Guardar y cerrar
          </button>
        </div>
      </motion.div>
    </div>
  );
};
