
export interface RangeTrendResult {
  deltaPct: number;
  avgDailyChangePct: number;
}

export function calculateRangeTrend(series: number[]): RangeTrendResult | null {
  if (series.length < 2) {
    return null;
  }

  const firstRate = series[0];
  const lastRate = series[series.length - 1];

  if (firstRate === 0) {
    return null;
  }

  const deltaPct = (lastRate - firstRate) / firstRate;

  const dailyChanges: number[] = [];
  for (let i = 1; i < series.length; i++) {
    const prevRate = series[i - 1];
    const currRate = series[i];
    if (prevRate !== 0) {
      dailyChanges.push((currRate - prevRate) / prevRate);
    }
  }

  const avgDailyChangePct =
    dailyChanges.length > 0
      ? dailyChanges.reduce((sum, change) => sum + change, 0) / dailyChanges.length
      : 0;

  return {
    deltaPct,
    avgDailyChangePct,
  };
}

export interface SingleDateDiffResult {
  deltaPct: number;
}

export function calculateSingleDateDiff(
  selected: number,
  today: number
): SingleDateDiffResult | null {
  if (selected === 0) {
    return null;
  }

  const deltaPct = (today - selected) / selected;

  return {
    deltaPct,
  };
}

