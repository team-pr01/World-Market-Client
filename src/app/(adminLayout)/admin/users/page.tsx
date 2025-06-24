/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState } from "react"

import { Input } from "@/components/ui/input"
import {
  LogOut,
  Users,
  Search,
  ArrowLeft,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/reusable/Button/Button"
import { useGetAllUserQuery } from "@/redux/Features/Admin/adminApi"
import UserCard from "./_components/UserCard"

export default function AdminUserAccountsPage() {
  const {data} = useGetAllUserQuery({});
  console.log(data, "all users data");
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated")
    router.push("/admin/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 md:p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Button
              onClick={() => router.push("/admin")}
              variant="ghost"
              size="icon"
              className="mr-2 text-gray-300 hover:text-white hover:bg-purple-700/50"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <Users className="w-10 h-10 text-purple-400 mr-3" />
            <h1 className="text-3xl font-bold">User Account Management</h1>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-gray-300 border-purple-600 hover:text-white hover:bg-purple-700/50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="mb-8 max-w-7xl mx-auto">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search by ID, Username, or Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border-gray-700 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
        </div>
        {/* Future filter options can go here */}
      </div>

      {/* User Cards Grid */}
      <main className="max-w-7xl mx-auto">
        {data?.data?.users?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.data?.users?.map((user: any, index:number) => (
              <UserCard key={index} user={user} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Users className="w-24 h-24 text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-500">No user accounts found matching your criteria.</p>
          </div>
        )}
      </main>
      <p className="text-xs text-center text-gray-500 mt-12 px-2">
        **Security Note:** User passwords are not displayed for security reasons. Password management should be handled
        via secure reset mechanisms.
      </p>
    </div>
  )
}
