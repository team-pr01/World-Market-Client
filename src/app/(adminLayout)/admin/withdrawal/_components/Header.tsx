import { Button } from "@/components/reusable/Button/Button";
import { ArrowLeft, ArrowUpCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header({ pending, total }: { pending: number; total: number }) {
     const router = useRouter();
     return (
          <header className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-16">
                         <Button
                              onClick={() => router.push("/admin")}
                              variant="ghost"
                              className="text-gray-300 hover:text-white hover:bg-gray-700 mr-4">
                              <ArrowLeft className="w-4 h-4 mr-2" />
                              Back
                         </Button>
                         <div className="flex items-center">
                              <ArrowUpCircle className="w-6 h-6 text-red-500 mr-2" />
                              <h1 className="text-xl font-bold text-white">
                                   Withdrawal Management
                              </h1>
                         </div>
                         <div className="ml-auto flex items-center gap-4">
                              <div className="bg-yellow-500/20 rounded-lg px-3 py-1">
                                   <span className="text-yellow-400 font-medium">
                                        Pending: {pending}
                                   </span>
                              </div>
                              <div className="bg-blue-500/20 rounded-lg px-3 py-1">
                                   <span className="text-blue-400 font-medium">
                                        Total: {total}
                                   </span>
                              </div>
                         </div>
                    </div>
               </div>
          </header>
     );
}
