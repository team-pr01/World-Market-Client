"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, ListChecks } from "lucide-react"

export default function TransactionHistoryLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="inline-flex items-center text-sm text-purple-400 mb-6">
          <ArrowLeft size={18} className="mr-1" />
          Back to Account
        </div>

        <header className="mb-8 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start mb-2">
            <ListChecks className="h-10 w-10 text-purple-400 mr-3" />
            <h1 className="text-4xl font-bold tracking-tight">Transaction History</h1>
          </div>
          <Skeleton className="h-4 w-1/2 md:w-1/3 mt-1 bg-slate-700" />
        </header>

        <Card className="bg-slate-800/50 backdrop-blur-md shadow-2xl border-slate-700 p-4 sm:p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="sm:col-span-2 space-y-1">
              <Skeleton className="h-3 w-24 bg-slate-700" />
              <Skeleton className="h-10 w-full bg-slate-700" />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:col-span-1">
              <div className="space-y-1">
                <Skeleton className="h-3 w-12 bg-slate-700" />
                <Skeleton className="h-10 w-full bg-slate-700" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3 w-12 bg-slate-700" />
                <Skeleton className="h-10 w-full bg-slate-700" />
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-slate-800/70 border-slate-700 text-slate-200 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-6 w-24 bg-slate-700" />
                  <Skeleton className="h-5 w-16 bg-slate-700" />
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/3 bg-slate-700" />
                  <Skeleton className="h-6 w-1/2 bg-slate-700" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/4 bg-slate-700" />
                  <Skeleton className="h-4 w-1/2 bg-slate-700" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/3 bg-slate-700" />
                  <Skeleton className="h-4 w-2/5 bg-slate-700" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
