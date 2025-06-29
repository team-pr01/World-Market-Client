/* eslint-disable @typescript-eslint/no-explicit-any */
import { setAccountType } from "@/redux/Features/AccountSwitcher/accountSwitcher";
import { useState, useRef, useEffect, MouseEvent } from "react";
import { useDispatch } from "react-redux";

interface BalanceSwitcherProps {
     demoBalance: number | null;
     mainBalance: number | null;
}

type AccountType = "demo" | "main";

export default function BalanceSwitcher({ demoBalance, mainBalance }: BalanceSwitcherProps) {
     const [isOpen, setIsOpen] = useState(false);
     const dispatch = useDispatch();
     const [selected, setSelected] = useState<AccountType>("demo");
     const ref = useRef<HTMLDivElement>(null);

     // Close dropdown when clicking outside
     useEffect(() => {
          const handleClickOutside = (event: MouseEvent<Document>) => {
               if (ref.current && !ref.current.contains(event.target as Node)) {
                    setIsOpen(false);
               }
          };
          document.addEventListener("mousedown", handleClickOutside as any);
          return () => document.removeEventListener("mousedown", handleClickOutside as any);
     }, []);

     // Helper to switch account
     const choose = (type: AccountType) => {
          setSelected(type);
          dispatch(setAccountType(type));
          setIsOpen(false);
     };

     // Data for rendering
     const accounts = {
          demo: {
               label: "Demo Account",
               subtitle: "Practice trading",
               dotColor: "bg-blue-400",
               balance: demoBalance ?? 0,
               containerBg: "bg-gray-700",
          },
          main: {
               label: "Live Account",
               subtitle: "Real trading",
               dotColor: "bg-green-400",
               balance: mainBalance ?? 0,
               containerBg: "", // no bg-gray-700
          },
     };

     const current = accounts[selected];

     return (
          <div className="relative inline-block" ref={ref}>
               {/* Trigger Button */}
               <button
                    onClick={() => setIsOpen((o) => !o)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors">
                    <div className={`w-2 h-2 rounded-full ${current.dotColor}`}></div>
                    <span
                         className={`font-medium ${
                              selected === "demo" ? "text-blue-400" : "text-green-400"
                         }`}>
                         {selected === "demo" ? "DEMO" : "LIVE"}
                    </span>
                    <span className="text-white font-medium">${current.balance.toFixed(2)}</span>
                    <svg
                         xmlns="http://www.w3.org/2000/svg"
                         width="16"
                         height="16"
                         viewBox="0 0 24 24"
                         fill="none"
                         stroke="currentColor"
                         strokeWidth="2"
                         strokeLinecap="round"
                         strokeLinejoin="round"
                         className={`lucide lucide-chevron-down transition-transform text-gray-400 ${
                              isOpen ? "rotate-180" : ""
                         }`}>
                         <path d="m6 9 6 6 6-6" />
                    </svg>
               </button>

               {/* Dropdown */}
               {isOpen && (
                    <div className="absolute top-full right-0 mt-2 bg-[#252833] border border-gray-700 rounded-lg shadow-lg z-50 min-w-[250px]">
                         <div className="p-3 space-y-2">
                              {/* Live Account Option */}
                              <button
                                   onClick={() => choose("main")}
                                   className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                                        selected === "main" ? "bg-gray-700" : ""
                                   }`}>
                                   <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                        <div className="text-left">
                                             <div className="font-medium">Live Account</div>
                                             <div className="text-xs text-gray-400">
                                                  Real trading
                                             </div>
                                        </div>
                                   </div>
                                   <span className="font-medium">
                                        ${(mainBalance ?? 0).toFixed(2)}
                                   </span>
                              </button>

                              {/* Demo Account Option */}
                              <button
                                   onClick={() => choose("demo")}
                                   className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                                        selected === "demo" ? "bg-gray-700" : ""
                                   }`}>
                                   <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                                        <div className="text-left">
                                             <div className="font-medium">Demo Account</div>
                                             <div className="text-xs text-gray-400">
                                                  Practice trading
                                             </div>
                                        </div>
                                   </div>
                                   <span className="font-medium">
                                        ${(demoBalance ?? 0).toFixed(2)}
                                   </span>
                              </button>
                         </div>
                    </div>
               )}
          </div>
     );
}
