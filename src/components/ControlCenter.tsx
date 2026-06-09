import React, { useState } from "react";
import { Employee } from "../types";
import { Clock, UserPlus, UserCheck, Calendar, Sparkles } from "lucide-react";

interface ControlCenterProps {
  employees: Employee[];
  activeEmployeeId: string;
  simulatedTime: string;
  onSelectEmployee: (id: string) => void;
  onAddEmployee: (name: string, role: string, avatar: string) => void;
  onChangeSimulatedTime: (isoString: string) => void;
}

export const ControlCenter: React.FC<ControlCenterProps> = ({
  employees,
  activeEmployeeId,
  simulatedTime,
  onSelectEmployee,
  onAddEmployee,
  onChangeSimulatedTime,
}) => {
  const [newEmpName, setNewEmpName] = useState("");
  const [newEmpRole, setNewEmpRole] = useState("Marketing Analyst");
  const [newEmpAvatar, setNewEmpAvatar] = useState("⚽");
  const [showAddForm, setShowAddForm] = useState(false);

  // Predefined simulated corporate timestamps for testing
  const presets = [
    { label: "Junio 11 (Inicio)", value: "2026-06-11T12:00:00", desc: "Todo abierto" },
    { label: "Junio 17 (Grupos)", value: "2026-06-17T18:00:00", desc: "Grupos en juego" },
    { label: "Junio 29 (Octavos)", value: "2026-06-29T20:00:00", desc: "Octavos de final" },
    { label: "Julio 4 (Octavos)", value: "2026-07-04T15:00:00", desc: "Octavos en juego" },
    { label: "Julio 19 (Finales)", value: "2026-07-19T18:00:00", desc: "Gran Final finalizada" },
  ];

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName.trim()) return;
    onAddEmployee(newEmpName.trim(), newEmpRole, newEmpAvatar);
    setNewEmpName("");
    setShowAddForm(false);
  };

  const activeEmployee = employees.find((emp) => emp.id === activeEmployeeId);

  // Format date readable
  const formatTimeStr = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("es-ES", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div id="control-center" className="bg-worldcup-card border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
      
      {/* Active User Switcher section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#94a3b8] flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-worldcup-accent" />
            Usuario Activo Actual
          </h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-xs bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600/50 border border-indigo-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all"
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
            <h4 className="text-sm font-bold text-white leading-tight">{activeEmployee?.name}</h4>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">{activeEmployee?.role}</p>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono font-bold mt-1 inline-block uppercase">
              Modo Pronóstico Activo
            </span>
          </div>
        </div>

        {/* Quick select employee switch buttons */}
        <div className="mt-3">
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
                      ? "bg-slate-900 border-worldcup-accent text-white"
                      : "bg-[#111936]/40 hover:bg-slate-900/60 border-slate-800/80 text-slate-300"
                  }`}
                >
                  <span className="text-sm shrink-0">{emp.avatar}</span>
                  <span className="truncate">{emp.name.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
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
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white focus:border-worldcup-accent focus:outline-none"
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
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white focus:border-worldcup-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1">Avatar / Emoji</label>
              <select
                value={newEmpAvatar}
                onChange={(e) => setNewEmpAvatar(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white focus:border-worldcup-accent focus:outline-none"
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

      {/* Clock / Virtual Simulated Time Section */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-[#94a3b8] flex items-center gap-1.5 mb-2">
          <Clock className="w-4 h-4 text-worldcup-accent" />
          Simulador de Reloj Corporativo
        </h3>
        <p className="text-xs text-slate-400 mb-3 leading-relaxed">
          Para certificar la regla de bloqueo, cambia la fecha corporativa simulada del sistema y ve qué partidos se cierran:
        </p>

        {/* Selected date display */}
        <div className="bg-[#1c2854]/40 border border-indigo-900/60 p-3 rounded-xl flex flex-col gap-1.5 mb-3">
          <div className="text-[10px] font-mono text-indigo-300 font-bold uppercase flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-worldcup-accent" />
            Fecha Virtual Actual del App:
          </div>
          <span className="text-sm font-black text-worldcup-accent font-mono">
            {formatTimeStr(simulatedTime)}
          </span>
        </div>

        {/* Preset Selector */}
        <div className="space-y-1.5">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest block">
            Seleccionar escenario temporal:
          </span>
          <div id="simulated-time-presets" className="space-y-1">
            {presets.map((preset) => {
              const isActive = simulatedTime === preset.value;
              return (
                <button
                  key={preset.value}
                  onClick={() => onChangeSimulatedTime(preset.value)}
                  className={`w-full py-1.5 px-3 rounded-lg text-xs font-mono font-medium text-left flex items-center justify-between border transition-all ${
                    isActive
                      ? "bg-slate-950 border-worldcup-accent text-worldcup-accent"
                      : "bg-[#111936]/40 hover:bg-[#18234a] border-slate-800/80 text-slate-300"
                  }`}
                >
                  <span>{preset.label}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-sans">
                    {preset.desc}
                  </span>
                </button>
              );
            })}
          </div>
          
          {/* Custom Date Input for fine grain selection */}
          <div className="mt-2.5 pt-2 border-t border-white/5">
            <label className="block text-[10px] text-slate-400 uppercase mb-1">
              Seleccionar fecha manually:
            </label>
            <input
              type="datetime-local"
              value={simulatedTime.substring(0, 16)}
              onChange={(e) => {
                if (e.target.value) {
                  onChangeSimulatedTime(new Date(e.target.value).toISOString());
                }
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 font-mono text-xs text-white focus:border-worldcup-accent focus:outline-none"
            />
          </div>
        </div>
      </div>

    </div>
  );
};
