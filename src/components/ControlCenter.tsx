import React, { useState } from "react";
import { Employee } from "../types";
import { Clock, UserPlus, UserCheck, Calendar, Sparkles } from "lucide-react";

interface ControlCenterProps {
  employees: Employee[];
  activeEmployeeId: string;
  onSelectEmployee: (id: string) => void;
  onAddEmployee: (name: string, role: string, avatar: string) => void;
}

export const ControlCenter: React.FC<ControlCenterProps> = ({
  employees,
  activeEmployeeId,
  onSelectEmployee,
  onAddEmployee,
}) => {
  const [newEmpName, setNewEmpName] = useState("");
  const [newEmpRole, setNewEmpRole] = useState("Marketing Analyst");
  const [newEmpAvatar, setNewEmpAvatar] = useState("⚽");
  const [showAddForm, setShowAddForm] = useState(false);

  // (Presets removed)

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName.trim()) return;
    onAddEmployee(newEmpName.trim(), newEmpRole, newEmpAvatar);
    setNewEmpName("");
    setShowAddForm(false);
  };

  const activeEmployee = employees.find((emp) => emp.id === activeEmployeeId);

  // (Format time str removed)

  return (
    <div id="control-center" className="bg-worldcup-card border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">

      {/* Active User Switcher section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-worldcup-accent" />
            Usuario Activo Actual
          </h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-xs bg-worldcup-indigo-btn text-worldcup-indigo-text hover:bg-worldcup-indigo-btn-hover border border-worldcup-indigo-border px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            {showAddForm ? "Cerrar" : "Unirse / Añadir"}
          </button>
        </div>

        {/* Selected Coworker Info */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-900 flex items-center gap-3">
          <span className="text-3xl bg-slate-900 border border-slate-800 p-2 rounded-xl" role="img">
            {activeEmployee?.avatar}
          </span>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-slate-100 leading-tight">{activeEmployee?.name}</h4>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">{activeEmployee?.role}</p>
            <span className="text-[10px] bg-worldcup-emerald-badge text-worldcup-emerald-text border border-worldcup-emerald-border px-1.5 py-0.5 rounded font-mono font-bold mt-1 inline-block uppercase">
              Modo Pronóstico Activo
            </span>
          </div>
        </div>

        {/* Quick select employee switch buttons */}
        {/*<div className="mt-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest block mb-1.5">
            Cambiar empleado rápidamente:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {employees.map((emp) => {
              const isSelected = emp.id === activeEmployeeId;
              return (
                <button
                  key={emp.id}
                  onClick={() => onSelectEmployee(emp.id)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium text-left truncate flex items-center gap-1.5 border transition-all ${
                    isSelected
                      ? "bg-slate-900 border-worldcup-accent text-slate-100"
                      : "bg-worldcup-bracket-container/40 hover:bg-slate-900/60 border-slate-800/80 text-slate-300"
                  }`}
                >
                  <span className="text-sm shrink-0">{emp.avatar}</span>
                  <span className="truncate">{emp.name.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        </div> */}
      </div>

      {/* Add Employee Form */}
      {showAddForm && (
        <form onSubmit={handleCreateEmployee} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Añadir Nuevo Participante</h4>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase mb-1">Nombre Completo</label>
            <input
              type="text"
              value={newEmpName}
              onChange={(e) => setNewEmpName(e.target.value)}
              placeholder="Ej. Martín Bianchi"
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-100 focus:border-worldcup-accent focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1">Rol / Cargo</label>
              <input
                type="text"
                value={newEmpRole}
                onChange={(e) => setNewEmpRole(e.target.value)}
                placeholder="Ej. Developer"
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-100 focus:border-worldcup-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1">Avatar / Emoji</label>
              <select
                value={newEmpAvatar}
                onChange={(e) => setNewEmpAvatar(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-100 focus:border-worldcup-accent focus:outline-none"
              >
                <option value="⚽">⚽ Balón</option>
                <option value="👨‍💻">👨‍💻 Dev</option>
                <option value="👩‍💻">👩‍💻 Dev Mujer</option>
                <option value="🎯">🎯 Diana</option>
                <option value="🦁">🦁 León</option>
                <option value="🦅">🦅 Águila</option>
                <option value="🍕">🍕 Pizza</option>
                <option value="🏆">🏆 Copa</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-worldcup-accent hover:bg-yellow-500 text-slate-900 font-bold py-1.5 rounded-lg text-xs transition-all flex items-center justify-center gap-1"
          >
            Añadir a la Polla Copa 2026
          </button>
        </form>
      )}

      {/* Clock section removed */}

    </div>
  );
};
