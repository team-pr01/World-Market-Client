"use client";
import {
  Globe,
  Shield,
  Smartphone,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

const Features = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 lg:mb-24 max-w-6xl mx-auto">
      <div className="text-center p-4 sm:p-6 lg:p-8 rounded-xl lg:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 group">
        <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-300">
          <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
        </div>
        <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 lg:mb-4">
          High Returns
        </h3>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          Earn up to 95% profit on successful trades with our competitive payout
          rates and advanced trading tools.
        </p>
      </div>

      <div className="text-center p-4 sm:p-6 lg:p-8 rounded-xl lg:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 group">
        <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-300">
          <Shield className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
        </div>
        <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 lg:mb-4">
          Secure Platform
        </h3>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          Your funds and data are protected with bank-level security measures
          and encrypted transactions.
        </p>
      </div>

      <div className="text-center p-4 sm:p-6 lg:p-8 rounded-xl lg:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 group">
        <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-300">
          <Zap className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
        </div>
        <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 lg:mb-4">
          Fast Execution
        </h3>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          Lightning-fast trade execution with real-time market data and
          professional trading charts.
        </p>
      </div>

      <div className="text-center p-4 sm:p-6 lg:p-8 rounded-xl lg:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 group">
        <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-300">
          <Smartphone className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
        </div>
        <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 lg:mb-4">
          Mobile Ready
        </h3>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          Trade anywhere, anytime with our fully responsive platform optimized
          for all devices.
        </p>
      </div>

      <div className="text-center p-4 sm:p-6 lg:p-8 rounded-xl lg:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 group">
        <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-300">
          <Users className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
        </div>
        <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 lg:mb-4">
          Expert Support
        </h3>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          Get 24/7 support from our team of trading experts and customer service
          professionals.
        </p>
      </div>

      <div className="text-center p-4 sm:p-6 lg:p-8 rounded-xl lg:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 group">
        <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-300">
          <Globe className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
        </div>
        <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 lg:mb-4">
          Global Markets
        </h3>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          Access global financial markets with hundreds of assets including
          forex, stocks, and commodities.
        </p>
      </div>
    </div>
  );
};

export default Features;
