import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownCircle, Badge } from "lucide-react";

interface TransactionCardProps {
     tx: {
          amount: number;
          status: string;
          transaction_id?: string;
          payment_method?: {
               method_name: string;
          };
          created_at: string;
     };
}

export default function TransactionCard({ tx }: TransactionCardProps) {
     const amount = tx.amount;

     return (
          <Card className="bg-slate-800/70 border-slate-700 text-slate-200 shadow-lg hover:shadow-purple-500/20 transition-shadow">
               <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                         <CardTitle className="text-lg flex items-center">
                              <ArrowDownCircle className="h-6 w-6 mr-2 text-green-400" />
                              Withdrawals
                         </CardTitle>
                         <Badge className="deposit">{tx?.status}</Badge>
                         {/* <Badge className={cn("text-xs", getStatusBadgeClasses(status, tx.type))}>{status}</Badge> */}
                    </div>
               </CardHeader>
               <CardContent className="text-sm space-y-2">
                    <div className="flex justify-between">
                         <span className="text-slate-400">Amount:</span>
                         <span className="font-semibold text-lg">{amount?.toFixed(2)} $</span>
                    </div>
                    <div className="flex justify-between">
                         <span className="text-slate-400">Transaction Id:</span>
                         <span className="font-semibold">{tx?.transaction_id || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                         <span className="text-slate-400">Payment Method:</span>
                         <span>{tx?.payment_method?.method_name}</span>
                    </div>
                    <div className="flex justify-between">
                         <span className="text-slate-400">Date:</span>
                         <span>{new Date(tx?.created_at).toLocaleDateString()}</span>
                    </div>
               </CardContent>
          </Card>
     );
}
