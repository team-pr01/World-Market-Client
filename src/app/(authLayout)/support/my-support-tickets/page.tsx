/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/reusable/Button/Button";
import {
  useGetSupportTicketsQuery,
  useReplyToTicketMutation,
} from "@/redux/Features/User/userApi";

export default function MySupportTickets() {
  const { data: titkctes, isLoading } = useGetSupportTicketsQuery({});
  const data = [
    {
      _id: "1",
      subject: "Deposit Issue",
      status: "Open",
      createdAt: new Date(),
    },
  ];
  const messages = [
    {
      _id: "1",
      message: "Hello, I'm having an issue with my deposit.",
      createdAt: new Date(),
      user: {
        _id: "1",
        name: "John Doe",
      },
    },
  ]
  const [openTicketId, setOpenTicketId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [replyToTicket] = useReplyToTicketMutation();

  const handleReply = async (ticketId: string) => {
    if (!reply.trim()) return toast.error("Reply cannot be empty.");
    try {
      await replyToTicket({ ticketId, message: reply }).unwrap();
      toast.success("Reply sent.");
      setReply("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send reply");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1D27] via-[#1C1F2A] to-[#252833] text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Support Tickets</h1>

        {isLoading ? (
          <p>Loading...</p>
        ) : data?.length === 0 ? (
          <p className="text-gray-400">No support tickets found.</p>
        ) : (
          <div className="space-y-4">
            {data?.map((ticket: any) => (
              <div
                key={ticket._id}
                className="bg-[#141720] p-4 rounded-lg border border-gray-700 shadow-sm flex justify-between items-center"
              >
                <div>
                  <h2 className="text-lg font-semibold">{ticket.subject}</h2>
                  <p className="text-gray-400 text-sm">
                    {ticket.status} •{" "}
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Dialog
                  open={openTicketId === ticket._id}
                  onOpenChange={(open) =>
                    setOpenTicketId(open ? ticket._id : null)
                  }
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="text-blue-400 border-blue-500 hover:bg-blue-500/10"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#1C1F2A] border border-slate-700 text-white max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Ticket: {ticket.subject}</DialogTitle>
                    </DialogHeader>

                    {/* Show Latest Admin Reply */}
                    {ticket.messages?.length > 0 && (
                      <>
                        {(() => {
                          const latestAdminReply = [...ticket.messages]
                            .reverse()
                            .find((msg: any) => msg.sender === "admin");

                          return latestAdminReply ? (
                            <div className="mb-4 border border-red-400 bg-red-900/20 rounded-lg p-4 shadow">
                              <h3 className="text-red-300 font-semibold mb-2">
                                Latest Admin Reply
                              </h3>
                              <p className="whitespace-pre-wrap">
                                {latestAdminReply.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                {formatDistanceToNow(
                                  new Date(latestAdminReply.createdAt),
                                  { addSuffix: true }
                                )}
                              </p>
                            </div>
                          ) : null;
                        })()}
                      </>
                    )}

                    {/* Message History */}
                    <div className="max-h-[300px] overflow-y-auto space-y-4 p-2 pr-1 mb-4">
                      {messages?.map((msg: any, index: number) => (
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
                            {formatDistanceToNow(new Date(msg.createdAt), {
                              addSuffix: true,
                            })}
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
}
