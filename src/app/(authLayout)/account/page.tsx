"use client"
import React, { useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/dialog"
import {  TooltipProvider } from "@/components/ui/tooltip"
import {
  UserCircle,
  Mail,
  KeyRound,
  MapPin,
  Phone,
  UploadCloud,
  Edit3,
  Globe,
  Ticket,
  ListChecks,
  ListFilter,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/reusable/Button/Button"
import { useGetMeQuery, useUpdateProfileMutation } from "@/redux/Features/User/userApi"

type EditableField = "username" | "address" | "phoneNumber" | null

const AccountPage = () => {
  const router = useRouter();
  const {data:profile} = useGetMeQuery({});
  console.log(profile);
  const [updateProfile, {isLoading:isProfileUpdating}] = useUpdateProfileMutation();

  const currentUser = {
    id: "12345",
    displayId: "user_12345",
    username: "john_doe",
    email: "ra1oB@example.com",
    name: "John Doe",
    address: "123 Main St, Anytown, USA",
    phoneNumber: "123-456-7890",
    country: "USA",
    profilePictureUrl: "/placeholder.svg?width=128&height=128&query=user+avatar",
    isVerified: false,
  }

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentEditingField, setCurrentEditingField] = useState<EditableField>(null)
  const [editValue, setEditValue] = useState("")

  const handleProfilePictureUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    console.log(file);
    
  }

  const openEditModal = (field: EditableField, currentValue?: string) => {
    setCurrentEditingField(field)
    setEditValue(currentValue || "")
    setIsEditModalOpen(true)
  }

  const handleSaveChanges = () => {
    // currentUser এখানে নিশ্চিতভাবে থাকবে
    
  }

  const getFieldLabel = (field: EditableField) => {
    if (!field) return ""
    switch (field) {
      case "username":
        return "Username"
      case "address":
        return "Address"
      case "phoneNumber":
        return "Phone Number"
      default:
        return ""
    }
  }

  const ProfileItem: React.FC<{
    icon: React.ElementType
    label: string
    value?: string
    isEditable?: boolean
    fieldKey?: EditableField
    onClick?: () => void
    isNavigation?: boolean
  }> = ({ icon: Icon, label, value, isEditable, fieldKey, onClick, isNavigation }) => (
    <div
      className={`flex items-center justify-between py-3 ${isNavigation ? "cursor-pointer hover:bg-slate-800/50 px-2 -mx-2 rounded-md transition-colors" : ""}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <Icon
          size={20}
          className={`mr-3 ${isNavigation ? "text-purple-400" : "text-gray-400"}`}
        />
        <div>
          <p
            className={`text-sm ${isNavigation ? "font-medium text-gray-200" : "text-gray-400"}`}
          >
            {label}
          </p>
          {!isNavigation && <p className="font-medium text-gray-50">{value || "Not set"}</p>}
        </div>
      </div>
      {isEditable && fieldKey && (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation()
            openEditModal(fieldKey, value)
          }}
        >
          <Edit3 size={18} className="text-gray-400" />
        </Button>
      )}
    </div>
  )

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-slate-900 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="overflow-hidden shadow-xl bg-slate-800 border border-slate-700 rounded-xl">
            <CardHeader className="bg-slate-800/50 p-6 border-b border-slate-700">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <div className="relative group">
                  <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-slate-700 shadow-md">
                    <AvatarImage
                      src={currentUser.profilePictureUrl || "/placeholder.svg?width=128&height=128&query=user+avatar"}
                      alt={currentUser.username}
                    />
                    <AvatarFallback className="text-4xl bg-slate-600  text-gray-200">
                      {currentUser.username ? currentUser.username.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    aria-label="Upload profile picture input"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute bottom-1 right-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-slate-700 hover:bg-slate-600 border-gray-300 dark:border-slate-600"
                    onClick={handleProfilePictureUpload}
                    aria-label="Upload profile picture"
                  >
                    <UploadCloud size={18} className="text-gray-300" />
                  </Button>
                </div>
                <div className="text-center md:text-left pt-2 md:pt-0">
                  <CardTitle className="text-2xl md:text-3xl text-gray-50">
                    {currentUser.username}
                  </CardTitle>
                  <CardDescription className="text-base text-gray-400">
                    {currentUser.email || "Email not set"}
                  </CardDescription>
                  <p className="text-xs text-gray-500 mt-1">User ID: {currentUser.displayId}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-100">Account Details</h3>
              <Separator className="mb-4 bg-slate-700" />
              <ProfileItem icon={Mail} label="Email" value={currentUser.email} />
              <Separator className="my-1 bg-slate-700/50" />
              <ProfileItem icon={KeyRound} label="User ID" value={currentUser.displayId} />
              <Separator className="my-1 bg-slate-700/50" />
              <ProfileItem
                icon={UserCircle}
                label="Username"
                value={currentUser.username}
                isEditable
                fieldKey="username"
              />
              <Separator className="my-1 bg-slate-700/50" />
              <ProfileItem icon={MapPin} label="Address" value={currentUser.address} isEditable fieldKey="address" />
              <Separator className="my-1 bg-slate-700/50" />
              <ProfileItem
                icon={Phone}
                label="Phone Number"
                value={currentUser.phoneNumber}
                isEditable
                fieldKey="phoneNumber"
              />
              <Separator className="my-1 bg-slate-700/50" />
              <ProfileItem icon={Globe} label="Country" value={currentUser.country} isEditable={false} />

              <Separator className="my-6 bg-slate-700" />
              <h3 className="text-lg font-semibold mb-4 text-gray-100">Activity & Support</h3>
              <Separator className="mb-4 bg-slate-700" />
              <ProfileItem
                icon={ListChecks}
                label="Transaction History"
                onClick={() => router.push("/transaction-history")}
                isNavigation
              />
              <Separator className="my-1 bg-slate-700/50" />
              <ProfileItem
                icon={ListFilter}
                label="Trades History"
                onClick={() => router.push("/trades-history")}
                isNavigation
              />
              <Separator className="my-1 bg-slate-700/50" />
              <ProfileItem
                icon={Ticket}
                label="My Support Tickets"
                onClick={() => router.push("/my-tickets")}
                isNavigation
              />

              {/* <Separator className="my-6 bg-slate-700" />
              <h3 className="text-lg font-semibold mb-4 text-gray-100">Verification Status</h3>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-700">
                <div className="flex items-center">
                  {currentUser.isVerified ? (
                    <ShieldCheck size={24} className="mr-3 text-green-500" />
                  ) : (
                    <ShieldAlert size={24} className="mr-3 text-yellow-500" />
                  )}
                  <p className="font-medium text-gray-100">
                    {currentUser.isVerified ? "Account Verified" : "Account Unverified"}
                  </p>
                </div>
                {!currentUser.isVerified && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span tabIndex={0}>
                        {" "}
                        <Button
                          onClick={handleVerify}
                          variant="default"
                          disabled={!canVerify}
                          className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-60"
                        >
                          Verify Account
                        </Button>
                      </span>
                    </TooltipTrigger>
                    {!canVerify && (
                      <TooltipContent className="bg-gray-800 text-white border-gray-700">
                        <p className="flex items-center">
                          <Info size={16} className="mr-2" />
                          Please complete Address, Phone, and Country to verify.
                        </p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                )}
              </div> */}
              {/* {currentUser.isVerified && (
                <p className="text-xs text-green-600 mt-2 text-center">
                  Your account is verified and all features are unlocked.
                </p>
              )}
              {!currentUser.isVerified && !canVerify && (
                <p className="text-xs text-yellow-600 mt-2 text-center">
                  Complete your profile (Address, Phone Number, Country) to enable account verification.
                </p>
              )}
              {!currentUser.isVerified && canVerify && (
                <p className="text-xs text-yellow-600 mt-2 text-center">
                  Verify your account to access all features and ensure security.
                </p>
              )} */}
            </CardContent>
          </Card>
        </div>

        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[425px] bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-gray-50">
                Edit {getFieldLabel(currentEditingField)}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Make changes to your {currentEditingField?.toLowerCase()}. Click save when you are done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-value" className="text-right text-gray-300">
                  {getFieldLabel(currentEditingField)}
                </Label>
                <Input
                  id="edit-value"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="col-span-3 bg-slate-700 border-slate-600 text-gray-50 placeholder-gray-500"
                  placeholder={`Enter new ${currentEditingField?.toLowerCase()}`}
                />
              </div>
            </div>
            <DialogFooter className="border-t border-slate-700 pt-4">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="border-slate-600 text-gray-300 hover:bg-slate-700"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="button"
                onClick={handleSaveChanges}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}

export default AccountPage
