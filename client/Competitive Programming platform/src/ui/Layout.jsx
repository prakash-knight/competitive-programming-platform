import { useState } from "react";
import TopNavbar from "./TopNavbar";
import Sidebar from "./Sidebar";
import "./styles.css";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="ui-root">
      <TopNavbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
