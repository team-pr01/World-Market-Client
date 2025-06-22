/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  WalletIcon,
  Plus,
  Upload,
  Trash2,
  Edit,
  Search,
  ChevronDown,
  Info,
  Clock,
  DollarSign,
  ArrowDownCircle,
  ArrowUpCircle,
  ToggleLeft,
  ToggleRight,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

// Add pagination imports
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from "@/components/reusable/Button/Button"
import { cn } from "@/utils/utils"

export default function WalletPage() {
  const router = useRouter()
  const [isAddWalletOpen, setIsAddWalletOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [newWallet, setNewWallet] = useState<Omit<any, "id">>({
    name: "",
    symbol: "",
    type: "Cryptocurrency",
    address: "",
    minDeposit: 0,
    minWithdrawal: 0,
    withdrawalFee: 0,
    processingTime: "",
    description: "",
    instructions: "",
    allowDeposit: true,
    allowWithdrawal: true,
    active: true,
    logo: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // In the WalletPage component, add pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const walletsPerPage = 6 // Number of wallets to display per page

  const filteredWallets:any[] = [1,2,3,4,5]

  // Update the filteredWallets logic to include pagination
  const paginatedWallets = useMemo(() => {
    const startIndex = (currentPage - 1) * walletsPerPage
    return filteredWallets.slice(startIndex, startIndex + walletsPerPage)
  }, [filteredWallets, currentPage, walletsPerPage])

  // Calculate total pages
  const totalPages = useMemo(
    () => Math.ceil(filteredWallets.length / walletsPerPage),
    [filteredWallets, walletsPerPage],
  )

  // Add a function to handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of wallet list
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleAddWallet = () => {
    setIsAddWalletOpen(true)
  }

  const handleEditWallet = (wallet: any) => {
    setNewWallet(wallet)
    setIsEditing(true)
    setEditingId(wallet.id)
    setIsAddWalletOpen(true)
  }

  const handleDeleteWallet = (id: number) => {
    console.log(id);
  }

  const resetForm = () => {
    setNewWallet({
      name: "",
      symbol: "",
      type: "Cryptocurrency",
      address: "",
      minDeposit: 0,
      minWithdrawal: 0,
      withdrawalFee: 0,
      processingTime: "",
      description: "",
      instructions: "",
      allowDeposit: true,
      allowWithdrawal: true,
      active: true,
      logo: "", // Remove the placeholder URL
    })
    setIsEditing(false)
    setEditingId(null)
  }

  const handleLogoUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // Handle file size error
        return
      }

      try {
        // Convert file to base64
        const reader = new FileReader()
        reader.onload = (event) => {
          const base64String = event.target?.result as string
          setNewWallet({ ...newWallet, logo: base64String })
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error("Error converting file to base64:", error)
      }
    }
  }

  const openAddWalletModal = () => {
    resetForm()
    setIsAddWalletOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              onClick={() => router.push("/admin")}
              variant="ghost"
              className="text-gray-300 hover:text-white hover:bg-gray-700 mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center">
              <WalletIcon className="w-6 h-6 text-blue-500 mr-2" />
              <h1 className="text-xl font-bold text-white">Wallet Management</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 sticky top-0 z-10 bg-gray-900/80 backdrop-blur-lg p-3 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search wallets..."
              className="pl-10 bg-gray-800/50 border-gray-700 text-white w-full md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
              <TabsList className="bg-gray-800/50 border border-gray-700">
                <TabsTrigger value="all" className="data-[state=active]:bg-blue-600">
                  All
                </TabsTrigger>
                <TabsTrigger value="active" className="data-[state=active]:bg-green-600">
                  Active
                </TabsTrigger>
                <TabsTrigger value="inactive" className="data-[state=active]:bg-red-600">
                  Inactive
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button
              onClick={openAddWalletModal}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Wallet
            </Button>
          </div>
        </div>

        {/* Wallets Grid with Pagination - This div should be scrollable */}
        <div className="flex-1 overflow-y-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          {filteredWallets.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {paginatedWallets.map((wallet) => (
                  <WalletCard key={wallet.id} wallet={wallet} onEdit={handleEditWallet} onDelete={handleDeleteWallet} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8 mb-12">
                  <Pagination>
                    <PaginationContent className="flex flex-wrap justify-center">
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }).map((_, index) => (
                        <PaginationItem key={index}>
                          <PaginationLink
                            onClick={() => handlePageChange(index + 1)}
                            isActive={currentPage === index + 1}
                            className="cursor-pointer"
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 p-8 text-center">
              <WalletIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-400 mb-2">No Wallets Found</h2>
              <p className="text-gray-500 mb-6">Add your first wallet to start managing cryptocurrency payments</p>
              <Button
                onClick={openAddWalletModal}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Wallet
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Wallet Dialog */}
      <Dialog open={isAddWalletOpen} onOpenChange={setIsAddWalletOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{isEditing ? "Edit Wallet" : "Add New Wallet"}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="type" className="text-gray-300">
                    Wallet Type
                  </Label>
                  <div className="relative mt-1">
                    <select
                      id="type"
                      value={newWallet.type}
                      onChange={(e) => setNewWallet({ ...newWallet, type: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 pl-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Cryptocurrency">Cryptocurrency</option>
                      <option value="Bangladesh Mobile Banking">Bangladesh Mobile Banking</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="E-Wallet">E-Wallet</option>
                      <option value="Fiat">Fiat</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="name" className="text-gray-300">
                    Wallet Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Bitcoin"
                    value={newWallet.name}
                    onChange={(e) => setNewWallet({ ...newWallet, name: e.target.value })}
                    className="mt-1 bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="symbol" className="text-gray-300">
                    Currency Symbol
                  </Label>
                  <Input
                    id="symbol"
                    placeholder="e.g., BTC"
                    value={newWallet.symbol}
                    onChange={(e) => setNewWallet({ ...newWallet, symbol: e.target.value })}
                    className="mt-1 bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="address" className="text-gray-300">
                    {newWallet.type === "Bangladesh Mobile Banking" ? "Mobile Number" : "Wallet Address"}
                  </Label>
                  <Input
                    id="address"
                    placeholder={
                      newWallet.type === "Bangladesh Mobile Banking"
                        ? "e.g., 01712345678"
                        : newWallet.type === "Cryptocurrency"
                          ? "e.g., bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
                          : "Enter address..."
                    }
                    value={newWallet.address}
                    onChange={(e) => setNewWallet({ ...newWallet, address: e.target.value })}
                    className="mt-1 bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minDeposit" className="text-gray-300">
                      Min Deposit
                    </Label>
                    <Input
                      id="minDeposit"
                      type="number"
                      placeholder="0.001"
                      value={newWallet.minDeposit}
                      onChange={(e) => setNewWallet({ ...newWallet, minDeposit: Number.parseFloat(e.target.value) })}
                      className="mt-1 bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="minWithdrawal" className="text-gray-300">
                      Min Withdrawal
                    </Label>
                    <Input
                      id="minWithdrawal"
                      type="number"
                      placeholder="0.002"
                      value={newWallet.minWithdrawal}
                      onChange={(e) => setNewWallet({ ...newWallet, minWithdrawal: Number.parseFloat(e.target.value) })}
                      className="mt-1 bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="withdrawalFee" className="text-gray-300">
                      Withdrawal Fee
                    </Label>
                    <Input
                      id="withdrawalFee"
                      type="number"
                      placeholder="0.0005"
                      value={newWallet.withdrawalFee}
                      onChange={(e) => setNewWallet({ ...newWallet, withdrawalFee: Number.parseFloat(e.target.value) })}
                      className="mt-1 bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="processingTime" className="text-gray-300">
                      Processing Time
                    </Label>
                    <Input
                      id="processingTime"
                      placeholder="e.g., 10-30 minutes"
                      value={newWallet.processingTime}
                      onChange={(e) => setNewWallet({ ...newWallet, processingTime: e.target.value })}
                      className="mt-1 bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Right Column */}
              <div>
                <Label htmlFor="description" className="text-gray-300">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Write a description about the wallet..."
                  value={newWallet.description}
                  onChange={(e) => setNewWallet({ ...newWallet, description: e.target.value })}
                  className="mt-1 bg-gray-700 border-gray-600 text-white h-20"
                />
              </div>

              <div>
                <Label htmlFor="instructions" className="text-gray-300">
                  Instructions
                </Label>
                <Textarea
                  id="instructions"
                  placeholder="Instructions for users when using this wallet..."
                  value={newWallet.instructions}
                  onChange={(e) => setNewWallet({ ...newWallet, instructions: e.target.value })}
                  className="mt-1 bg-gray-700 border-gray-600 text-white h-20"
                />
              </div>

              <div>
                <h3 className="text-gray-300 mb-2">Transaction Types</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ArrowDownCircle className="h-5 w-5 text-green-500" />
                      <Label htmlFor="allowDeposit" className="text-gray-300">
                        Allow Deposit
                      </Label>
                    </div>
                    <Switch
                      id="allowDeposit"
                      checked={newWallet.allowDeposit}
                      onCheckedChange={(checked) => setNewWallet({ ...newWallet, allowDeposit: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ArrowUpCircle className="h-5 w-5 text-red-500" />
                      <Label htmlFor="allowWithdrawal" className="text-gray-300">
                        Allow Withdrawal
                      </Label>
                    </div>
                    <Switch
                      id="allowWithdrawal"
                      checked={newWallet.allowWithdrawal}
                      onCheckedChange={(checked) => setNewWallet({ ...newWallet, allowWithdrawal: checked })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-gray-300 block mb-2">Wallet Logo</Label>
                <div className="flex items-center space-x-4">
                  <div className="h-20 w-20 rounded-lg bg-gray-700 border border-gray-600 flex items-center justify-center overflow-hidden">
                    {newWallet.logo ? (
                      <img
                        src={newWallet.logo || "/placeholder.svg"}
                        alt="Logo preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs text-center">No Logo</span>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleLogoUpload}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Select Logo
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="active" className="text-gray-300">
                    Active
                  </Label>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
                <Switch
                  id="active"
                  checked={newWallet.active}
                  onCheckedChange={(checked) => setNewWallet({ ...newWallet, active: checked })}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsAddWalletOpen(false)
                resetForm()
              }}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAddWallet}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white w-full sm:w-auto"
            >
              {isEditing ? "Save Changes" : "Add Wallet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Wallet Card Component
function WalletCard({ wallet, onEdit, onDelete } : { wallet: any, onEdit: (wallet: any) => void, onDelete: (id: number) => void }) {
  // Determine icon based on wallet type
  const getWalletTypeIcon = (type:any) => {
    switch (type) {
      case "Bangladesh Mobile Banking":
        return "🇧🇩"
      case "Cryptocurrency":
        return "₿"
      case "Bank Transfer":
        return "🏦"
      case "E-Wallet":
        return "💳"
      default:
        return "💱"
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] h-full">
      <div
        className={cn(
          "h-2 w-full",
          wallet.active
            ? "bg-gradient-to-r from-green-500 to-emerald-500"
            : "bg-gradient-to-r from-red-500 to-orange-500",
        )}
      />

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full overflow-hidden mr-3 bg-gray-700 border border-gray-600 flex items-center justify-center">
              {wallet.logo ? (
                <img
                  src={wallet.logo || "/placeholder.svg"}
                  alt={`${wallet.name} logo`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xl">{getWalletTypeIcon(wallet.type)}</span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{wallet.name}</h3>
              <div className="flex items-center">
                <span className="text-sm text-gray-400">{wallet.symbol}</span>
                <span
                  className={cn(
                    "ml-2 px-2 py-0.5 text-xs rounded-full",
                    wallet.active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400",
                  )}
                >
                  {wallet.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(wallet)}
              className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(wallet.id)}
              className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm">
            <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-gray-300">Min Deposit: </span>
            <span className="ml-auto text-white font-medium">
              {wallet.minDeposit} {wallet.symbol}
            </span>
          </div>

          <div className="flex items-center text-sm">
            <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-gray-300">Min Withdrawal: </span>
            <span className="ml-auto text-white font-medium">
              {wallet.minWithdrawal} {wallet.symbol}
            </span>
          </div>

          <div className="flex items-center text-sm">
            <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-gray-300">Withdrawal Fee: </span>
            <span className="ml-auto text-white font-medium">
              {wallet.withdrawalFee} {wallet.symbol}
            </span>
          </div>

          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-gray-300">Processing Time: </span>
            <span className="ml-auto text-white font-medium">{wallet.processingTime}</span>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              {wallet.allowDeposit ? (
                <ToggleRight className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ToggleLeft className="h-4 w-4 text-gray-500 mr-1" />
              )}
              <span className={cn("text-xs", wallet.allowDeposit ? "text-green-400" : "text-gray-500")}>Deposit</span>
            </div>

            <div className="flex items-center">
              {wallet.allowWithdrawal ? (
                <ToggleRight className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ToggleLeft className="h-4 w-4 text-gray-500 mr-1" />
              )}
              <span className={cn("text-xs", wallet.allowWithdrawal ? "text-green-400" : "text-gray-500")}>
                Withdrawal
              </span>
            </div>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(wallet)}
            className="text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  )
}
