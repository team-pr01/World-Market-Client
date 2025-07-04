import { Button } from "@/components/reusable/Button/Button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Withdraw as WithdrawType } from "@/type/withdraw";
import { Eye, User } from "lucide-react";

export default function WithdrawalCard({
     withdrawal,
     onViewDetails,
     isPending,
}: {
     withdrawal: WithdrawType;
     onViewDetails: (withdrawal: WithdrawType) => void;
     isPending: boolean;
}) {
     console.log(withdrawal);
     const getStatusBadge = (status: WithdrawType["status"]) => {
          switch (status) {
               case "pending":
                    return (
                         <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                              Pending
                         </Badge>
                    );
               case "approved":
                    return (
                         <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              Approved
                         </Badge>
                    );
               case "rejected":
                    return (
                         <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                              Rejected
                         </Badge>
                    );
               default:
                    return (
                         <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                              Unknown
                         </Badge>
                    );
          }
     };

     return (
          <Card
               className={`bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                    isPending ? "border-yellow-500/50" : ""
               }`}>
               <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                         <CardTitle className="text-lg font-bold text-white flex items-center">
                              <User className="w-5 h-5 mr-2 text-blue-400" />
                              {withdrawal?.user_id?.username}
                         </CardTitle>
                         {getStatusBadge(withdrawal.status)}
                    </div>
               </CardHeader>
               <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                         <span className="text-gray-400 text-sm">Amount:</span>
                         <span className="text-white font-bold uppercase">
                              {withdrawal?.amount?.toFixed(2) || 0} {withdrawal?.currency}
                         </span>
                    </div>
                    <div className="flex justify-between items-center">
                         <span className="text-gray-400 text-sm">Transaction Id:</span>
                         <span className="text-white text-sm">{withdrawal.transaction_id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                         <span className="text-gray-400 text-sm">Method:</span>
                         <span className="text-white text-sm">{withdrawal.payment_method.method_type}</span>
                    </div>
                    <div className="flex justify-between items-center">
                         <span className="text-gray-400 text-sm">Date:</span>
                         <span className="text-white text-sm">
                              {new Date(withdrawal.created_at).toLocaleDateString()}
                         </span>
                    </div>
                    <Button
                         onClick={() => onViewDetails(withdrawal)}
                         className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                         <Eye className="w-4 h-4 mr-2" />
                         View Details
                    </Button>
               </CardContent>
          </Card>
     );
}
