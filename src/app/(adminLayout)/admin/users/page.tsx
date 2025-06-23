/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState, useMemo } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  LogOut,
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  UserCircle,
  ShieldCheck,
  ShieldOff,
  DollarSign,
  Briefcase,
  ArrowLeft,
  Eye,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/reusable/Button/Button"
import { useGetAllUserQuery } from "@/redux/Features/Admin/adminApi"

export default function AdminUserAccountsPage() {
  const {data} = useGetAllUserQuery({});
  console.log(data, "all users data");
  const allUsers:any[] = [1,2,3,]
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated")
    router.push("/admin/login")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
  }

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return allUsers
    return allUsers.filter(
      (user) =>
        user.displayId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [allUsers, searchTerm])

  const UserCard = ({ user }: { user: any }) => (
    <Card className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-purple-500/30 transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="flex flex-row items-center space-x-4 p-4">
        <Avatar className="h-16 w-16 border-2 border-purple-500">
          <AvatarImage
            src={user.profilePictureUrl || `/placeholder.svg?width=64&height=64&query=${user.username}+avatar`}
            alt={user.username}
          />
          <AvatarFallback className="bg-gray-700 text-purple-400">
            {/* {user.username.substring(0, 2).toUpperCase()} */}
            R
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-xl font-semibold text-purple-400">{user.username}</CardTitle>
          <p className="text-xs text-gray-400">ID: {user.displayId}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3 text-sm flex-grow">
        <div className="flex items-center text-gray-300">
          <Mail className="w-4 h-4 mr-2 text-purple-400" />
          <span>{user.email || "N/A"}</span>
        </div>
        <div className="flex items-center text-gray-300">
          <Phone className="w-4 h-4 mr-2 text-purple-400" />
          <span>{user.phoneNumber || "N/A"}</span>
        </div>
        <div className="flex items-center text-gray-300">
          <MapPin className="w-4 h-4 mr-2 text-purple-400" />
          <span>{user.address || "N/A"}</span>
        </div>
        <div className="flex items-center text-gray-300">
          <UserCircle className="w-4 h-4 mr-2 text-purple-400" />
          <span>Country: {user.country || "N/A"}</span>
        </div>
        <div className="flex items-center">
          {user.isVerified ? (
            <ShieldCheck className="w-4 h-4 mr-2 text-green-500" />
          ) : (
            <ShieldOff className="w-4 h-4 mr-2 text-red-500" />
          )}
          <Badge
            variant={user.isVerified ? "default" : "destructive"}
            className={
              user.isVerified
                ? "bg-green-600/80 hover:bg-green-500 text-white text-xs"
                : "bg-red-600/80 hover:bg-red-500 text-white text-xs"
            }
          >
            {user.isVerified ? "Verified" : "Not Verified"}
          </Badge>
        </div>
        <div className="border-t border-gray-700 pt-3 space-y-2">
          <div className="flex items-center justify-between text-gray-300">
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-green-400" />
              <span>Live Balance:</span>
            </div>
            <span className="font-semibold text-green-400">{formatCurrency(user.balance)}</span>
          </div>
          <div className="flex items-center justify-between text-gray-300">
            <div className="flex items-center">
              <Briefcase className="w-4 h-4 mr-2 text-blue-400" />
              <span>Demo Balance:</span>
            </div>
            <span className="font-semibold text-blue-400">{formatCurrency(user.demoBalance)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t border-gray-700">
        <Button
          variant="outline"
          size="sm"
          className="w-full border-purple-500 text-purple-400 hover:bg-purple-600 hover:text-white transition-colors duration-200"
        >
          <Eye className="w-4 h-4 mr-2" /> View Details
        </Button>
      </CardFooter>
    </Card>
  )

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
        {filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map((index, user: any) => (
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
