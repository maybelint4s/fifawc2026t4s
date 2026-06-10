import React from "react";
import { Employee } from "../types";
import { UserPlus, UserCheck } from "lucide-react";

interface ControlCenterProps {
  employees: Employee[];
  activeEmployeeId: string;
  onJoin: () => void;
  isAuthenticated: boolean;
}

export const ControlCenter: React.FC<ControlCenterProps> = ({
  employees,
  activeEmployeeId,
  onJoin,
  isAuthenticated,
}) => {
  const activeEmployee = employees.find((emp) => emp.id === activeEmployeeId);

  return (
    <div id="control-center" className="bg-worldcup-card border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-worldcup-accent" />
            Usuario Activo Actual
          </h3>

          {!isAuthenticated && (
            <button
              onClick={onJoin}
              className="text-xs bg-worldcup-indigo-btn text-worldcup-indigo-text hover:bg-worldcup-indigo-btn-hover border border-worldcup-indigo-border px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Unirse / Añadir
            </button>
          )}
        </div>

        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-900 flex items-center gap-3">
          <span className="text-3xl bg-slate-900 border border-slate-800 p-2 rounded-xl" role="img">
            {activeEmployee?.avatar ?? "👤"}
          </span>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-slate-100 leading-tight">
              {activeEmployee?.name ?? "Invitado"}
            </h4>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              {activeEmployee?.role ?? "Inicia sesión o crea tu cuenta para participar"}
            </p>
            <span className="text-[10px] bg-worldcup-emerald-badge text-worldcup-emerald-text border border-worldcup-emerald-border px-1.5 py-0.5 rounded font-mono font-bold mt-1 inline-block uppercase">
              {isAuthenticated ? "Modo Pronóstico Activo" : "Registro requerido"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
