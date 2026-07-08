// components/AdminSidebar.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import CheckAuth from "../api/Controller/Authentication/checkAuth";
import LogoutApi from "../api/Controller/Authentication/Logout";
import {
  Banknote,
  Briefcase,
  ChevronDown,
  ChevronRight,
  Code2,
  LayoutDashboard,
  List,
  LogOut,
  Menu,
  Truck,
  Users,
  X,
} from "lucide-react";

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true); // Start open on desktop
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    content: false,
    shipping: false,
    users: false,
    settings: false,
  });

  const navigation = [
    {
      heading: "",
      id: "dashboard",
      label: "Dashboard (ڈیش بورڈ)",
      icon: LayoutDashboard,
      href: "/AdminSetting/Dashboard",
      type: "link",
    },
    {
      heading: "MASTER DATA (ماسٹر ڈیٹا)",
      subHeading: [
        {
          id: "employee",
          label: "Employee (ملازم)",
          icon: Briefcase,
          href: "/AdminSetting/Codes/Employees",
          type: "link",
        },
        {
          id: "vehicle",
          label: "Vehicle (گاڑی)",
          icon: Truck,
          href: "/AdminSetting/Codes/Vehicle",
          type: "link",
        },
        {
          id: "category",
          label: "Category (زمرہ)",
          icon: List,
          href: "/AdminSetting/Codes/Category",
          type: "link",
        },
        {
          id: "bank",
          label: "Bank (بینک)",
          icon: Banknote,
          href: "/AdminSetting/Codes/Bank",
          type: "link",
        },
        {
          id: "ownerInvestort",
          label: "Owner/Investor (مالکان)",
          icon: Users,
          href: "/AdminSetting/Codes/OwnerInvestor",
          type: "link",
        },
      ],
    },
  ];

  const logOut = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) return (window.location.href = "/");
    await LogoutApi(String(token));
    localStorage.removeItem("adminToken");
    window.location.href = "/";
  };

  const checkAuth = async () => {
    const token = localStorage.getItem("adminToken");
    const response = await CheckAuth(String(token));
    if (response.status === 200) {
      return;
    } else {
      window.location.href = "/";
      return;
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const toggleMenu = (menuId: string) => {
    setOpenMenus((prev) => ({ ...prev, [menuId]: !prev[menuId] }));
  };

  const isActive = (href: string) => {
    if (href === "/admin" && pathname === "/admin") return true;
    if (href !== "/admin" && pathname?.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      {/* Mobile menu button - now outside sidebar */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-4 top-4 z-50 rounded-xl bg-white p-2 shadow-lg lg:hidden dark:bg-gray-800"
      >
        <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - No main wrapper, just the aside */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-full w-72 transform flex-col bg-gray-900 transition-transform duration-300 shadow-xl dark:bg-gray-800 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Section */}
        <div className="flex h-20 items-center justify-between border-b border-gray-200 px-6 dark:border-gray-700">
          <div className="flex items-center gap-3 px-4 py-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
              ML
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">
                ML Recycler
              </p>
              <p className="text-xs text-white text-muted-white">
                ERP System (ای آر پی)
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          {navigation.map((item, index) => (
            <div key={index} className="mb-4">
              {/* Show Heading */}
              {item.heading && (
                <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {item.heading}
                </h3>
              )}

              {/* If it has subHeading, render those */}
              {item.subHeading ? (
                item.subHeading.map((subItem) => (
                  <Link
                    key={subItem.id}
                    href={subItem.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group mb-2 flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-300 ${
                      isActive(subItem.href)
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <subItem.icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />

                    <span>{subItem.label}</span>

                    {isActive(subItem.href) && (
                      <div className="ml-auto h-2 w-2 rounded-full bg-white"></div>
                    )}
                  </Link>
                ))
              ) : (
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-300 ${
                    isActive(item.href)
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <item.icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />

                  <span>{item.label}</span>

                  {isActive(item.href) && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-white"></div>
                  )}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="border-t border-gray-200 dark:border-gray-700">
          {/* Logout Button */}
          <div className="p-4 w-full ">
            <button
              onClick={logOut}
              className="flex text-white w-full items-center gap-3 rounded-xl px-4 py-3 text-gray-700 transition-all duration-200 hover:text-white hover:bg-red-500 dark:text-gray-300 dark:hover:bg-red-900/20 dark:hover:text-red-400 group"
            >
              <LogOut className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

// Helper component for Image icon
function ImageIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="2.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  );
}
