/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowUpCircle, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/reusable/Button/Button";
import { useAdminCloseSupportTicketMutation, useAdminReplyOnSupportTicketMutation, useGetAllSupportTicketsAdminQuery } from "@/redux/Features/Admin/adminApi";
import Link from "next/link";

const AdminSupportTickets = () => {
  const { data:tickets, isLoading } = useGetAllSupportTicketsAdminQuery({});
  console.log(tickets);
  const [reply, setReply] = useState("");
  const [openTicketId, setOpenTicketId] = useState<string | null>(null);
  const [adminReplyOnSupportTicket] = useAdminReplyOnSupportTicketMutation();
  const [adminCloseSupportTicket] = useAdminCloseSupportTicketMutation();

  const handleReply = async (id : string) => {
    if (!reply.trim()) return toast.error("Reply cannot be empty");
    try {
      await adminReplyOnSupportTicket({ id  , message: reply }).unwrap();
      toast.success("Reply sent successfully");
      setReply("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send reply");
    }
  };

  const handleClose = async (id : string) => {
    try {
      await adminCloseSupportTicket(id).unwrap();
      toast.success("Ticket closed successfully");
      setReply("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1D27] to-[#252833] text-white p-6">
        {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href={"/admin"}>
            <Button
              variant="ghost"
              className="text-gray-300 hover:text-white hover:bg-gray-700 mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            </Link>
            <div className="flex items-center">
              <ArrowUpCircle className="w-6 h-6 text-red-500 mr-2" />
              <h1 className="text-xl font-bold text-white">
               Support Tickets
              </h1>
            </div>
            <div className="ml-auto">
              <div className="bg-blue-500/20 rounded-lg px-3 py-1">
                <span className="text-blue-400 font-medium">
                  Total: 444
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>


      <div className="max-w-6xl mx-auto mt-10">

        {isLoading ? (
          <p>Loading tickets...</p>
        ) : tickets?.data?.tickets?.length === 0 ? (
          <p className="text-gray-400">No tickets found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets?.data?.tickets.map((ticket: any) => (
              <div
                key={ticket._id}
                className="bg-[#141720] border border-slate-700 p-4 rounded-lg shadow hover:shadow-blue-400/10 transition"
              >
                <h2 className="text-lg font-semibold mb-1 capitalize">{ticket.subject}</h2>
                <p className="text-sm text-gray-400 mb-1">
                  From: <span className="text-blue-300">{ticket.user?.username || "User"}</span>
                </p>
                <p className="text-sm text-gray-400 mb-1">Status: {ticket.status}</p>
                <p className="text-xs text-gray-500 mb-4">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </p>

                <Dialog
                  open={openTicketId === ticket._id}
                  onOpenChange={(open) => setOpenTicketId(open ? ticket._id : null)}
                >
                  <DialogTrigger asChild>
                    <>
                    <Button variant="outline" className="text-blue-400 border-blue-500 hover:bg-blue-500/10 w-full">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      View & Reply
                    </Button>
                    <Button onClick={() => handleClose(ticket._id)} variant="outline" className="text-blue-400 border-blue-500 hover:bg-blue-500/10 w-full mt-3">
                   
                      Close Ticket
                    </Button>
                    </>
                  </DialogTrigger>

                  <DialogContent className="bg-[#1C1F2A] border border-slate-700 text-white max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        Ticket: {ticket.subject}
                        <span className="block text-sm font-normal text-gray-400 mt-1">
                          From: {ticket.user?.username} ({ticket.user?.email})
                        </span>
                      </DialogTitle>
                    </DialogHeader>

                    {/* Latest user message as a card */}
                    {ticket.replies?.length > 0 && (
                      <>
                        {(() => {
                          const lastUserMsg = [...ticket.replies]
                            .reverse()
                            .find((m: any) => m.sender === "user");

                          return lastUserMsg ? (
                            <div className="mb-4 border border-blue-400 bg-blue-900/20 rounded-lg p-4 shadow">
                              <h3 className="text-blue-300 font-semibold mb-2">Latest User Message</h3>
                              <p className="whitespace-pre-wrap">{lastUserMsg.message}</p>
                              <p className="text-xs text-gray-400 mt-2">
                                {formatDistanceToNow(new Date(lastUserMsg.createdAt), {
                                  addSuffix: true,
                                })}
                              </p>
                            </div>
                          ) : null;
                        })()}
                      </>
                    )}

                    {/* Full message history */}
                    <div className="max-h-[300px] overflow-y-auto space-y-4 p-2 pr-1 mb-4">
                      {ticket.replies?.map((msg: any, index: number) => (
                        <div
                          key={index}
                          className={`p-3 rounded-md text-sm ${
                            msg.sender === "admin"
                              ? "bg-slate-700 text-red-300"
                              : "bg-slate-800 text-green-300"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {msg.sender} •{" "}
                            {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Reply Input */}
                    <div>
                      <label htmlFor="reply" className="text-sm mb-1 block">
                        Your Reply
                      </label>
                      <Textarea
                        id="reply"
                        placeholder="Write your reply..."
                        className="bg-[#252833] border-gray-700 text-white"
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                      />
                      <Button
                        onClick={() => handleReply(ticket._id)}
                        className="mt-2 bg-blue-600 hover:bg-blue-700"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send Reply
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSupportTickets;
