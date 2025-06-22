"use client" // Required for client component if it uses hooks or event handlers

// Re-exporting the skeleton from the page file for simplicity, or define it here.
// For a separate file, you'd define the skeleton component directly.

const AdminMediaLoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-8">
    <div className="bg-gray-800/60 border-gray-700 text-white rounded-lg shadow-xl">
      {/* Header Skeleton */}
      <div className="p-6 border-b border-gray-700 flex justify-between items-center">
        <div className="h-8 w-1/3 bg-gray-700 rounded animate-pulse"></div> {/* Title Skeleton */}
        <div className="h-10 w-32 bg-gray-700 rounded animate-pulse"></div> {/* Button Skeleton */}
      </div>

      {/* Content Skeleton */}
      <div className="p-6">
        {/* Description Skeleton */}
        <div className="h-6 w-1/2 bg-gray-700 rounded animate-pulse mb-6"></div>

        {/* Search Input Skeleton */}
        <div className="mb-6">
          <div className="h-10 w-full bg-gray-700 rounded animate-pulse"></div>
        </div>

        {/* Table Skeleton */}
        <div className="overflow-x-auto">
          {/* Table Header Skeleton */}
          <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-t-md mb-1">
            <div className="h-5 w-1/6 bg-gray-600 rounded animate-pulse"></div>
            <div className="h-5 w-2/6 bg-gray-600 rounded animate-pulse"></div>
            <div className="h-5 w-2/6 bg-gray-600 rounded animate-pulse"></div>
            <div className="h-5 w-1/6 bg-gray-600 rounded animate-pulse"></div>
          </div>

          {/* Table Rows Skeleton */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-between items-center p-4 border-b border-gray-700/50 animate-pulse">
              <div className="h-6 w-6 bg-gray-600 rounded-full"></div> {/* Icon Skeleton */}
              <div className="h-5 w-1/4 bg-gray-600 rounded ml-4"></div> {/* Name Skeleton */}
              <div className="h-5 w-2/5 bg-gray-600 rounded"></div> {/* URL Skeleton */}
              <div className="flex space-x-2">
                {" "}
                {/* Actions Skeleton */}
                <div className="h-8 w-8 bg-gray-600 rounded"></div>
                <div className="h-8 w-8 bg-gray-600 rounded"></div>
              </div>
            </div>
          ))}
        </div>

        {/* No items message skeleton (optional, if you want to show something specific) */}
        {/* <div className="text-center py-8">
          <div className="h-6 w-1/3 bg-gray-700 rounded animate-pulse mx-auto"></div>
        </div> */}
      </div>
    </div>
  </div>
)

export default AdminMediaLoadingSkeleton
