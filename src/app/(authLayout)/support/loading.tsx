import { Skeleton } from "@/components/ui/skeleton"
import { LifeBuoy, ChevronLeft } from "lucide-react"

export default function SupportLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1D27] via-[#1C1F2A] to-[#252833] text-white flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl">
        <div className="inline-flex items-center text-sm text-blue-400 mb-6">
          <ChevronLeft size={18} className="mr-1" />
          <Skeleton className="h-4 w-24 bg-gray-700" />
        </div>

        <div className="bg-[#141720]/80 backdrop-blur-md shadow-2xl rounded-xl p-6 sm:p-10">
          <div className="text-center mb-8">
            <LifeBuoy className="mx-auto h-16 w-16 text-blue-500 mb-4 opacity-50" />
            <Skeleton className="h-10 w-3/4 mx-auto bg-gray-700 mb-3" />
            <Skeleton className="h-4 w-full max-w-md mx-auto bg-gray-600" />
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Skeleton className="h-5 w-20 mb-2 bg-gray-600" />
                <Skeleton className="h-10 w-full bg-gray-700" />
              </div>
              <div>
                <Skeleton className="h-5 w-20 mb-2 bg-gray-600" />
                <Skeleton className="h-10 w-full bg-gray-700" />
              </div>
            </div>
            <div>
              <Skeleton className="h-5 w-20 mb-2 bg-gray-600" />
              <Skeleton className="h-10 w-full bg-gray-700" />
            </div>
            <div>
              <Skeleton className="h-5 w-20 mb-2 bg-gray-600" />
              <Skeleton className="h-32 w-full bg-gray-700" />
            </div>
            <Skeleton className="h-12 w-full bg-blue-500/50" />
          </div>
        </div>
        <Skeleton className="h-4 w-1/2 mx-auto mt-8 bg-gray-600" />
      </div>
    </div>
  )
}
