"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, ListFilter } from "lucide-react"

export default function TradesHistoryLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="inline-flex items-center text-sm text-purple-400 mb-6">
          <ArrowLeft size={18} className="mr-1" />
          Back to Trading
        </div>

        <header className="mb-8 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start mb-2">
            <ListFilter className="h-10 w-10 text-purple-400 mr-3" />
            <h1 className="text-4xl font-bold tracking-tight">Trades History</h1>
          </div>
          <Skeleton className="h-4 w-1/2 md:w-1/3 mt-1 bg-slate-700" />
        </header>

        <Card className="bg-slate-800/50 backdrop-blur-md shadow-2xl border-slate-700 p-4 sm:p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="lg:col-span-1 space-y-1">
              <Skeleton className="h-3 w-24 bg-slate-700" />
              <Skeleton className="h-10 w-full bg-slate-700" />
            </div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-3 w-12 bg-slate-700" />
                <Skeleton className="h-10 w-full bg-slate-700" />
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-slate-800/70 border-slate-700 text-slate-200 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-6 w-3/5 bg-slate-700" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-5 w-12 bg-slate-700" />
                    <Skeleton className="h-5 w-12 bg-slate-700" />
                  </div>
                </div>
                <Skeleton className="h-3 w-2/5 bg-slate-700 mt-1" />
              </CardHeader>
              <CardContent className="text-sm space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <Skeleton className="h-4 w-full bg-slate-700" />
                  <Skeleton className="h-4 w-full bg-slate-700" />
                  <Skeleton className="h-4 w-full bg-slate-700" />
                  <Skeleton className="h-4 w-full bg-slate-700" />
                </div>
                <Skeleton className="h-px w-full bg-slate-700/50 my-2" />
                <Skeleton className="h-3 w-full bg-slate-700" />
                <Skeleton className="h-3 w-full bg-slate-700" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
