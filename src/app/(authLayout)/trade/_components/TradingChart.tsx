/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import "./TradingChart.css";

const TradingChart = ({ chartRef, candleSeriesRef } : { chartRef: any, candleSeriesRef: any}) => {
     const chartContainerRef = useRef(null);
     const [tooltip, setTooltip] = useState({
          visible: false,
          data: null,
          position: { x: 0, y: 0 },
     });

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
                    barSpacing: 25,
                    tickMarkFormatter: (time:any) => {
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
          const candleSeries = chart.addCandlestickSeries();
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

     return (
          <div className="chart-container">
               <div ref={chartContainerRef} className="chart" />
               <div className="vertical-line" />
               {tooltip.visible && tooltip.data && (
                    <div
                         className="candle-tooltip"
                         style={{
                              left: tooltip.position.x,
                              top: tooltip.position.y,
                         }}>
                         <div className="tooltip-row">
                              <span className="tooltip-label">Open:</span>
                              <span className="tooltip-value">{tooltip.data.open.toFixed(2)}</span>
                         </div>
                         <div className="tooltip-row">
                              <span className="tooltip-label">High:</span>
                              <span className="tooltip-value">{tooltip.data.high.toFixed(2)}</span>
                         </div>
                         <div className="tooltip-row">
                              <span className="tooltip-label">Low:</span>
                              <span className="tooltip-value">{tooltip.data.low.toFixed(2)}</span>
                         </div>
                         <div className="tooltip-row">
                              <span className="tooltip-label">Close:</span>
                              <span className="tooltip-value">{tooltip.data.close.toFixed(2)}</span>
                         </div>
                    </div>
               )}
          </div>
     );
};

export default TradingChart;
