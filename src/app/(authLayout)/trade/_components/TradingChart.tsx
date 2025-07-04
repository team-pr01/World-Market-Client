/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import "./TradingChart.css";

interface TradingChartProps {
     chartRef: any;
     candleSeriesRef: any;
     isMobile: boolean;
}

const TradingChart = ({ chartRef, candleSeriesRef, isMobile }: TradingChartProps) => {
     const chartContainerRef = useRef(null);
     const [tooltip, setTooltip] = useState({
          visible: false,
          data: null,
          position: { x: 0, y: 0 },
     });

     const handleResetChart = () => {
          if (chartRef.current) {
               chartRef.current.timeScale().scrollToPosition(25, false);
          }
     };

     const handleZoomIn = () => {
          if (chartRef.current) {
               const currentBarSpacing = chartRef.current.timeScale().options().barSpacing;
               chartRef.current.timeScale().applyOptions({
                    barSpacing: Math.min(currentBarSpacing * 1.5, 50),
               });
          }
     };

     const handleZoomOut = () => {
          if (chartRef.current) {
               const currentBarSpacing = chartRef.current.timeScale().options().barSpacing;
               chartRef.current.timeScale().applyOptions({
                    barSpacing: Math.max(currentBarSpacing / 1.5, 5),
               });
          }
     };

     useEffect(() => {
          if (!chartContainerRef.current) return;

          // Create chart
          const chart = createChart(chartContainerRef.current, {
               layout: {
                    background: {
                         type: 0 as any,
                         color: "#000000",
                    },
                    textColor: "#ffffff",
               },
               grid: {
                    vertLines: { color: "#0a0a0a" },
                    horzLines: { color: "#0a0a0a" },
               },
               crosshair: {
                    mode: 1, // Normal
               },
               handleScroll: {
                    mouseWheel: true,
                    pressedMouseMove: true,
                    horzTouchDrag: true,
                    vertTouchDrag: true,
               },
               handleScale: {
                    axisPressedMouseMove: true,
                    mouseWheel: true,
                    pinch: true,
               },
               timeScale: {
                    timeVisible: true,
                    secondsVisible: false,
                    barSpacing: isMobile ? 14 : 20,
                    tickMarkFormatter: (time: any) => {
                         const d = new Date(time * 1000);
                         return (
                              d.getHours().toString().padStart(2, "0") +
                              ":" +
                              d.getMinutes().toString().padStart(2, "0")
                         );
                    },
               },
          });

          chartRef.current = chart;

          // Add candlestick series
          const candleSeries = chart.addCandlestickSeries({
               upColor: "#00A63E",
               downColor: "#FB2C36",
               wickUpColor: "#00A63E",
               wickDownColor: "#FB2C36",
               priceFormat: {
                    type: "price",
                    precision: 5,
                    minMove: 0.00001,
               },
          });
          candleSeriesRef.current = candleSeries;

          // Tooltip functionality
          chart.subscribeCrosshairMove((param) => {
               if (param.time && param.seriesData && param.seriesData.get(candleSeries)) {
                    const candleData = param.seriesData.get(candleSeries);
                    const chartRect = chartContainerRef.current.getBoundingClientRect();

                    // Calculate tooltip position
                    const tooltipWidth = 120;
                    const tooltipHeight = 80;
                    let left = param.point.x + 10;
                    let top = param.point.y - tooltipHeight - 10;

                    // Adjust position if tooltip goes outside chart bounds
                    if (left + tooltipWidth > chartRect.width) {
                         left = param.point.x - tooltipWidth - 10;
                    }
                    if (top < 0) {
                         top = param.point.y + 10;
                    }

                    setTooltip({
                         visible: true,
                         data: candleData,
                         position: { x: left, y: top },
                    });
               } else {
                    setTooltip({ visible: false, data: null, position: { x: 0, y: 0 } });
               }
          });

          // Cleanup
          return () => {
               if (chartRef.current) {
                    chartRef.current.remove();
               }
          };
     }, []);

     const [time, setTime] = useState<string>("");
     const [timezone, setTimezone] = useState<string>("");

     useEffect(() => {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          setTimezone(tz);

          const updateClock = () => {
               const now = new Date();
               const formatter = new Intl.DateTimeFormat("en-US", {
                    timeZone: tz,
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    hour12: true,
               });
               setTime(formatter.format(now));
          };

          updateClock(); // set immediately
          const interval = setInterval(updateClock, 1000);

          return () => clearInterval(interval);
     }, []);

     return (
          <div className="chart-container">
               <div ref={chartContainerRef} className="chart" />
               <div className="absolute hidden left-1 md:left-5 top-2 md:top-5 z-10 md:flex flex-col items-start gap-1 bg-white/80 dark:bg-gray-900/80 px-3 py-2 rounded-xl shadow-md backdrop-blur-sm text-sm md:text-base font-medium">
                    <div className="flex items-center gap-1">
                         <span>🕒</span>
                         <span className="text-green-500">{time}</span>
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 text-center w-full">
                         ({timezone})
                    </div>
               </div>

               {/* Reset Button */}
               <button
                    onClick={handleResetChart}
                    className="absolute top-3 right-18 z-10 cursor-pointer bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors flex items-center gap-1"
                    title="Reset Chart Position">
                    <RotateCcw size={16} />
               </button>

               {/* Zoom In Button */}
               <button
                    onClick={handleZoomIn}
                    className="absolute top-3 right-30 z-10 cursor-pointer bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors flex items-center gap-1"
                    title="Zoom In">
                    <ZoomIn size={16} />
               </button>

               {/* Zoom Out Button */}
               <button
                    onClick={handleZoomOut}
                    className="absolute top-3 right-42 z-10 cursor-pointer bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors flex items-center gap-1"
                    title="Zoom Out">
                    <ZoomOut size={16} />
               </button>

               {tooltip.visible && tooltip.data && (
                    <div
                         className="candle-tooltip"
                         style={{
                              left: tooltip.position.x,
                              top: tooltip.position.y,
                         }}>
                         <div className="tooltip-row">
                              <span className="tooltip-label">Open:</span>
                              <span className="tooltip-value">{tooltip.data.open.toFixed(5)}</span>
                         </div>
                         <div className="tooltip-row">
                              <span className="tooltip-label">High:</span>
                              <span className="tooltip-value">{tooltip.data.high.toFixed(5)}</span>
                         </div>
                         <div className="tooltip-row">
                              <span className="tooltip-label">Low:</span>
                              <span className="tooltip-value">{tooltip.data.low.toFixed(5)}</span>
                         </div>
                         <div className="tooltip-row">
                              <span className="tooltip-label">Close:</span>
                              <span className="tooltip-value">{tooltip.data.close.toFixed(5)}</span>
                         </div>
                    </div>
               )}
          </div>
     );
};

export default TradingChart;
