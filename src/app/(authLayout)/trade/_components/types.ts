// types.ts
import type { ComposeOption } from 'echarts/core';
import type {
  CandlestickSeriesOption,
  LineSeriesOption,
} from 'echarts/charts';
import type {
  GridComponentOption,
  TooltipComponentOption,
  DataZoomComponentOption,
  VisualMapComponentOption,
} from 'echarts/components';

export type ECOption = ComposeOption<
  | CandlestickSeriesOption
  | LineSeriesOption
  | GridComponentOption
  | TooltipComponentOption
  | DataZoomComponentOption
  | VisualMapComponentOption
>;
