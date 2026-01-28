
import React from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Home", path: "/", icon: "🏠" },
  { label: "SOFIE AI", path: "/sofie", icon: "🤖" },
  { label: "Wellness", path: "/wellness", icon: "🧘" },
  { label: "Records", path: "/records", icon: "📋" },
  { label: "Emergency", path: "/emergency", icon: "🚨" },
];

const MainMenu = () => {
  const location = useLocation();
  return (
    <nav className="main-menu flex justify-center gap-6 py-4 px-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-b-3xl shadow-lg">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex flex-col items-center px-4 py-2 rounded-2xl font-semibold text-lg transition-all ${location.pathname === item.path ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow" : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
          style={{ minWidth: 80 }}
        >
          <span className="text-2xl mb-1">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default MainMenu;
