import React, { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import {
  CandlestickChart,
  LineChart,
} from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
  VisualMapComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { ECOption } from "./types";

echarts.use([
  CandlestickChart,
  LineChart,
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
  VisualMapComponent,
  CanvasRenderer,
]);

const sampleData = Array.from({ length: 50 }, (_, i) => {
  const open = +(1.07 + Math.random() * 0.01).toFixed(5);
  const close = +(open + (Math.random() - 0.5) * 0.01).toFixed(5);
  const low = +(Math.min(open, close) - Math.random() * 0.003).toFixed(5);
  const high = +(Math.max(open, close) + Math.random() * 0.003).toFixed(5);
  return [open, close, low, high];
});


const TradingKlineChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    const option: ECOption = {
      backgroundColor: "#1C1F2A",
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
      },
      grid: {
        left: "0%",
        right: "0%",
        top: 10,
        bottom: 40,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: sampleData.map((_, i) => `T${i + 1}`),
        scale: true,
        boundaryGap: false,
        axisLine: { lineStyle: { color: "#888" } },
      },
      yAxis: {
        scale: true,
        axisLine: { lineStyle: { color: "#888" } },
        splitLine: { lineStyle: { color: "#333" } },
      },
      dataZoom: [
    {
      type: "inside", // for mouse wheel / swipe scroll
      xAxisIndex: 0,
      start: 50, // initial zoom position
      end: 100,
    },
    {
      type: "slider", // visible scrollbar
      xAxisIndex: 0,
      start: 50,
      end: 100,
      height: 20,
      bottom: 10,
    },
  ],
      series: [
  {
    type: "candlestick",
    data: sampleData,
    barMaxWidth: 10, // 👈 limits the width
    itemStyle: {
      color: "#00ff00",
      color0: "#ff0000",
      borderColor: "#00ff00",
      borderColor0: "#ff0000",
    },
  },
],

    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);
    return () => {
      chart.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <div ref={chartRef} className="w-full h-full" />;
};

export default TradingKlineChart;
