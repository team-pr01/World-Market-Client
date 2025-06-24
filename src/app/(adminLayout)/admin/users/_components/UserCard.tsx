/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  UserCircle,
  // ShieldCheck,
  // ShieldOff,
  DollarSign,
  Briefcase,
  Eye,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/reusable/Button/Button';

const UserCard = ({user} : {user:any}) => {
    console.log(user);
    return (
        <Card className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-purple-500/30 transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="flex flex-row items-center space-x-4 p-4">
        <Avatar className="h-16 w-16 border-2 border-purple-500">
          <AvatarImage
            src={user.profilePictureUrl || `/placeholder.svg?width=64&height=64&query=${user.username}+avatar`}
            alt={user.username}
          />
          <AvatarFallback className="bg-gray-700 text-purple-400">
            {user.username.substring(0, 2).toUpperCase()}
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
          <span>{user?.email || "N/A"}</span>
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
        {/* <div className="flex items-center">
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
        </div> */}
        <div className="border-t border-gray-700 pt-3 space-y-2">
          <div className="flex items-center justify-between text-gray-300">
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-green-400" />
              <span>Live Balance:</span>
            </div>
            <span className="font-semibold text-green-400">${user?.main_balance || 0}</span>
          </div>
          <div className="flex items-center justify-between text-gray-300">
            <div className="flex items-center">
              <Briefcase className="w-4 h-4 mr-2 text-blue-400" />
              <span>Demo Balance:</span>
            </div>
            <span className="font-semibold text-blue-400">${user?.demo_balance || 0}</span>
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
    );
};

export default UserCard;