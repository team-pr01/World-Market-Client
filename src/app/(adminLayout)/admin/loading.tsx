export default function Loading() {
     return (
          <div className="flex h-screen items-center justify-center bg-white">
               <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                    <p className="mt-4 text-gray-700 text-sm">Loading...</p>
               </div>
          </div>
     );
}
