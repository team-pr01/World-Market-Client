"use client"

import { useRouter } from "next/navigation"
import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  LogOut,
  Shield,
  Users,
  LifeBuoy,
  Share2,
  LayoutDashboard,
} from "lucide-react"
import { Button } from "@/components/reusable/Button/Button"
import Link from "next/link"

export default function AdminDashboard() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated")
    router.push("/admin/login")
  }

  const menuItems = [
    {
      title: "Dashboard",
      description: "View key platform statistics",
      icon: LayoutDashboard, // New Icon
      color: "from-indigo-500 to-purple-600", // Example color
      href: "/admin/dashboard", // Link to the new page
    },
    {
      title: "Withdrawal",
      description: "Manage withdrawal requests",
      icon: ArrowUpCircle,
      color: "from-red-500 to-red-600",
      href: "/admin/withdrawal",
    },
    {
      title: "Deposit",
      description: "Manage deposit transactions",
      icon: ArrowDownCircle,
      color: "from-green-500 to-green-600",
      href: "/admin/deposit",
    },
    {
      title: "Wallet",
      description: "Manage user wallets (legacy)",
      icon: Wallet,
      color: "from-blue-500 to-blue-600",
      href: "/admin/wallet",
    },
    {
      title: "User Accounts",
      description: "View and manage user details",
      icon: Users,
      color: "from-purple-500 to-purple-600",
      href: "/admin/users",
    },
    {
      // New Menu Item for Support Tickets
      title: "Support Tickets",
      description: "View and manage user support tickets",
      icon: LifeBuoy,
      color: "from-yellow-500 to-orange-600", // Example color
      href: "/admin/support",
    },
    {
      title: "Media Links",
      description: "Manage social media and other links",
      icon: Share2, // Using Share2 icon for media/sharing
      color: "from-teal-500 to-cyan-600",
      href: "/admin/media",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-500 mr-3" />
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            </div>
            <Button onClick={handleLogout} variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-700">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome to Admin Dashboard</h2>
          <p className="text-gray-400">Select an option to manage your platform</p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.title}
                href={item.href}
                className="group relative overflow-hidden rounded-2xl bg-gray-800/50 backdrop-blur-lg border border-gray-700 p-6 md:p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />
                <div className="relative z-10">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${item.color} mb-4`}
                  >
                    <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
                  <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}
