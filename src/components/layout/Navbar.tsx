import type { ChangeEvent } from "react";
import { useFinanceStore } from "../../store/useFinanceStore";

const Navbar = () => {
  const { role, setRole } = useFinanceStore();

  return (
    <div className="flex items-center justify-between px-6 py-4 backdrop-blur-md bg-white/5 border-b border-white/10">
      <h1 className="text-lg font-semibold tracking-wide">
        Fin<span className="text-green-400">Dash</span>
      </h1>
      <div className="flex items-center gap-4">
        <select
          value={role}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setRole(e.target.value as "viewer" | "admin")
          }
          className="bg-neutral-800 border border-white/10 rounded-md px-3 py-1 text-sm"
        >
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>

        <div className="w-8 h-8 rounded-full bg-white/20" />
      </div>
    </div>
  );
};

export default Navbar;
