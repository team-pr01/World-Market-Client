import React from "react";

const Stats = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-8 mb-12 sm:mb-16 lg:mb-24 max-w-4xl mx-auto">
      <div className="text-center p-3 sm:p-4 lg:p-6 rounded-xl lg:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
        <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-blue-400 mb-1 sm:mb-2">
          50K+
        </div>
        <div className="text-gray-400 text-xs sm:text-sm lg:text-base">
          Active Traders
        </div>
      </div>
      <div className="text-center p-3 sm:p-4 lg:p-6 rounded-xl lg:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
        <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-green-400 mb-1 sm:mb-2">
          95%
        </div>
        <div className="text-gray-400 text-xs sm:text-sm lg:text-base">
          Max Payout
        </div>
      </div>
      <div className="text-center p-3 sm:p-4 lg:p-6 rounded-xl lg:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
        <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-purple-400 mb-1 sm:mb-2">
          $1
        </div>
        <div className="text-gray-400 text-xs sm:text-sm lg:text-base">
          Min Trade
        </div>
      </div>
      <div className="text-center p-3 sm:p-4 lg:p-6 rounded-xl lg:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
        <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-yellow-400 mb-1 sm:mb-2">
          24/7
        </div>
        <div className="text-gray-400 text-xs sm:text-sm lg:text-base">
          Support
        </div>
      </div>
    </div>
  );
};

export default Stats;
