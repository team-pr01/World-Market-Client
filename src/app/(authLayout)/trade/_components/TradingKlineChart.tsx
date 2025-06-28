/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts/core";
import { CandlestickChart, LineChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
  VisualMapComponent,
  GraphicComponent,
  MarkLineComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { ECOption } from "./types";
import { useSocket } from "./SocketView";

echarts.use([
  CandlestickChart,
  LineChart,
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
  VisualMapComponent,
  GraphicComponent,
  MarkLineComponent,
  CanvasRenderer,
]);

const TradingKlineChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { liveData, currentPrice } = useSocket();
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [countdown, setCountdown] = useState(60);
  const lastCandleTimestampRef = useRef<number | null>(null);
  const isInitialLoad = useRef(true);

  // --- All timer and initialization logic remains the same ---
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const timerId = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => { if (countdown === 0) setCountdown(60); }, [countdown]);

  useEffect(() => {
    if (liveData.length === 0) return;
    const currentCandleTimestamp = liveData[0].timestamp;
    if (currentCandleTimestamp && currentCandleTimestamp !== lastCandleTimestampRef.current) {
      setCountdown(60);
      lastCandleTimestampRef.current = currentCandleTimestamp;
    }
  }, [liveData]);

  useEffect(() => {
    if (!chartRef.current) return;
    chartInstance.current = echarts.init(chartRef.current);
    const handleResize = () => chartInstance.current?.resize();
    window.addEventListener("resize", handleResize);
    return () => {
      chartInstance.current?.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const chart = chartInstance.current;
    if (!chart || liveData.length === 0 || !currentPrice) return;

    const priceString = currentPrice.toFixed(5);
    const timeString = formatTime(countdown);
    const combinedLabelText = `${priceString}\n${timeString}`;
    
    // This is the data for the x-axis
    const xAxisData = liveData.map(item => {
      const date = new Date(item.timestamp);
      return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    });

    const option: ECOption = {
      backgroundColor: "#1C1F2A",
      tooltip: { trigger: "axis", axisPointer: { type: "cross" } },
      // Give more top/bottom margin to the grid for better padding
      grid: { left: "2%", right: 120, top: "10%", bottom: "15%" },
      xAxis: {
        type: "category",
        data: xAxisData, // Use the pre-calculated axis data
        axisLine: { lineStyle: { color: '#8392A5' } },
        axisLabel: { color: '#8392A5' }
      },
      yAxis: {
        scale: true, // This is key! It adds padding automatically.
        splitLine: { show: true, lineStyle: { color: '#363c4f' } },
        axisLine: { show: true, lineStyle: { color: '#8392A5' } },
        axisLabel: { color: '#8392A5' },
        // REMOVED the manual min/max functions. They are no longer needed.
      },
      dataZoom: [
        { type: "inside", start: 70, end: 100 },
        { type: "slider", start: 70, end: 100, bottom: 10, handleSize: '120%' },
      ],
      series: [
        { // This is your main candlestick series
          type: "candlestick",
          data: liveData.map(item => item.value),
          itemStyle: {
            color: "#00ff00", color0: "#ff0000",
            borderColor: "#00ff00", borderColor0: "#ff0000",
          },
          // The markLine is now purely for VISUALS
          markLine: {
            symbol: ['none', 'none'],
            lineStyle: { type: 'dotted', color: '#facc15', width: 2 },
            label: {
              show: true, position: 'end', backgroundColor: '#facc15',
              color: '#1C1F2A', fontWeight: 'bold', padding: [5, 10],
              borderRadius: 4, formatter: combinedLabelText,
            },
            data: [{ yAxis: currentPrice }],
            animation: false,
          },
        },
        {
          type: 'line',
          data: [ // Data has two points to span the chart
             // Use the first x-axis category and the current price
            [xAxisData[0], currentPrice], 
            // Use the last x-axis category and the current price
            [xAxisData[xAxisData.length - 1], currentPrice]
          ],
          // Make it completely invisible and non-interactive
          symbol: 'none',
          lineStyle: {
            opacity: 0
          },
          silent: true, 
        }
      ],
    };

    if (isInitialLoad.current && liveData.length > 1) {
      chart.setOption(option);
      isInitialLoad.current = false;
    } else {
      // On updates, we must send the whole series array and x-axis data
      // so ECharts can process the new ghost series and candle data correctly.
      chart.setOption({
        // xAxis: {
        //   data: option.xAxis.data
        // },
        series: option.series,
      });
    }

  }, [liveData, countdown, currentPrice]);

  return <div ref={chartRef} className="w-full h-full" />;
};

export default TradingKlineChart;