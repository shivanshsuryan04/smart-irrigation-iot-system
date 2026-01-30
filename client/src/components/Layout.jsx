import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Leaf, Home, TrendingUp, Settings, Users, Menu, X } from "lucide-react";
import { useAppContext } from "../context/AppContext";

// Header Component
const Header = ({ onMenuToggle, isMobileMenuOpen }) => {
  const { systemStatus } = useAppContext();

  return (
    <header className="bg-gradient-to-br from-green-900 to-emerald-900 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#22C55E] rounded-xl shadow-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Smart Irrigation System
              </h1>
              <p className="text-sm text-gray-300">
                IoT-Powered Agriculture Solution
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-white">ESP32</p>
              <p className="text-xs text-gray-300">ThingSpeak Connected</p>
            </div>
            <div className="relative">
              <div
                className={`w-3 h-3 rounded-full ${
                  systemStatus.wifiConnected ? "bg-green-500" : "bg-red-500"
                } shadow-lg`}
              />
              <div
                className={`w-3 h-3 rounded-full absolute top-0 ${
                  systemStatus.wifiConnected ? "bg-green-500" : "bg-red-500"
                } animate-ping`}
              />
            </div>
          </div>

          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

// Navigation Component
const Navigation = ({ isMobile, isOpen, onNavigate }) => {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/analytics", label: "Analytics", icon: TrendingUp },
    { path: "/crop-recommendation", label: "Crop Guide", icon: Leaf },
    { path: "/settings", label: "Settings", icon: Settings },
    { path: "/about", label: "About", icon: Users },
  ];

  const NavButton = ({ item, isActive, onClick }) => (
    <button
      onClick={() => {
        onClick(item.path);
        onNavigate?.(item.path);
      }}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
        isActive
          ? "bg-[#22C55E] text-white shadow-lg transform scale-105"
          : "text-gray-600 hover:bg-white/50 hover:text-green-600 hover:shadow-md"
      }`}
    >
      <item.icon className="w-5 h-5" />
      <span className="font-medium">{item.label}</span>
    </button>
  );

  const navigate = useNavigate();

  const handleNavClick = (path) => {
    navigate(path);
  };

  if (isMobile) {
    return (
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:hidden bg-white/90 backdrop-blur-md border-b border-white/20 shadow-lg`}
      >
        <div className="px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <NavButton
              key={item.path}
              item={item}
              isActive={location.pathname === item.path}
              onClick={handleNavClick}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <nav className="hidden md:block w-64 bg-white/50 backdrop-blur-md rounded-2xl shadow-xl p-6 sticky top-24 h-fit">
      <div className="space-y-2">
        {navItems.map((item) => (
          <NavButton
            key={item.path}
            item={item}
            isActive={location.pathname === item.path}
            onClick={handleNavClick}
          />
        ))}
      </div>
    </nav>
  );
};

// Layout Component
const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileNavigation = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-sky-100 to-teal-100 relative overflow-hidden">
      {/* Decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-200/30 rounded-full -translate-x-32 -translate-y-32 blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-300/20 rounded-full -translate-x-24 translate-y-24 blur-2xl -z-10"></div>
      <div className="absolute top-1/3 left-1/2 w-96 h-96 bg-teal-200/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl animate-pulse -z-10"></div>

      {/* Header & Navigation */}
      <Header
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      <Navigation
        isMobile={true}
        isOpen={isMobileMenuOpen}
        onNavigate={handleMobileNavigation}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <Navigation isMobile={false} isOpen={false} />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
