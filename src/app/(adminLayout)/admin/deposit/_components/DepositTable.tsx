'use client';
import { Button } from "@/components/reusable/Button/Button";
import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
} from "@/components/ui/table";
import { Deposit } from "@/type/deposit";
import { Eye } from "lucide-react";
import React from "react";

interface depositTableProps {
     deposits: Deposit[];
     handleViewDetails: (deposit: Deposit) => void;
     getStatusBadge: (status: string) => React.JSX.Element;
}

export function DepositTable({ deposits, handleViewDetails, getStatusBadge }: depositTableProps) {
     return (
          <Table>
               <TableHeader className="bg-gray-800">
                    <TableRow className="hover:bg-gray-800/80 border-gray-700">
                         <TableHead className="text-gray-400">User</TableHead>
                         <TableHead className="text-gray-400">Email</TableHead>
                         <TableHead className="text-gray-400">Amount</TableHead>
                         <TableHead className="text-gray-400">Payment Method</TableHead>
                         <TableHead className="text-gray-400">Date</TableHead>
                         <TableHead className="text-gray-400">Status</TableHead>
                         <TableHead className="text-gray-400 text-right">Actions</TableHead>
                    </TableRow>
               </TableHeader>
               <TableBody>
                    {deposits?.map((deposit: Deposit, index: number) => (
                         <TableRow key={index} className="hover:bg-gray-800/50 border-gray-700">
                              <TableCell className="font-medium text-white">
                                   {deposit?.user_id?.username}
                              </TableCell>
                              <TableCell className="font-medium text-white">
                                   {deposit?.user_id?.email}
                              </TableCell>
                              <TableCell className="text-white">
                                   {deposit.amount} {deposit.currency}
                              </TableCell>
                              <TableCell className="text-gray-300">
                                   {deposit.payment_method.method_type}
                              </TableCell>
                              <TableCell className="text-gray-300">
                                   {new Date(deposit.created_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell>{getStatusBadge(deposit.status)}</TableCell>
                              <TableCell className="text-right">
                                   <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleViewDetails(deposit)}
                                        className="text-gray-300 hover:text-white hover:bg-gray-700">
                                        <Eye className="h-4 w-4 mr-1" />
                                        Details
                                   </Button>
                              </TableCell>
                         </TableRow>
                    ))}
               </TableBody>
          </Table>
     );
}
