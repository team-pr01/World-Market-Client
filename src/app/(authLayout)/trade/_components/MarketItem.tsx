import { DollarSign, Star } from "lucide-react";

// Extracted Market Item Component
interface Market {
     logo?: React.ReactNode;
     pair: string;
     market_type: string;
     type: string;
     price: string | number;
     commission_percentage?: string | number;
}

const MarketItem = ({ market, onClick }: { market: Market; onClick: () => void }) => (
     <div
          className="flex items-center justify-between p-3 hover:bg-gray-800 transition-colors"
          onClick={onClick}>
          <div className="flex items-center min-w-0">
               <span className="mr-2 text-lg min-w-[24px] text-center">
                    {market.logo || <DollarSign />}
               </span>
               <div className="min-w-0 truncate">
                    <div className="flex items-center gap-1.5 text-sm truncate">
                         <span className="font-medium truncate">{market.pair}</span>
                         <span className="text-yellow-500 uppercase text-xs">
                              ({market.market_type})
                         </span>
                         <span className="text-gray-400 text-xs">{market.type}</span>
                    </div>
               </div>
          </div>

          <div className="flex items-center gap-2 ml-2">
               <div className="text-right min-w-[70px]">
                    <div className="truncate">{market.price}</div>
                    <div className="text-yellow-500 text-xs">
                         {market?.commission_percentage ?? "100"}%
                    </div>
               </div>
               <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 text-gray-400 hover:text-yellow-400">
                    <Star size={18} fill="yellow" />
               </button>
          </div>
     </div>
);

export default MarketItem;
