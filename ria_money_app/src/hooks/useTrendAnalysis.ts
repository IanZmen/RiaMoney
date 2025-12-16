import { useState, useEffect } from "react";
import { getTimeSeries, getRatesByDate, getLatestRates } from "@/api/exchangeRates";
import { getCurrencies } from "@/api/currencies";
import { getUserErrorMessage } from "@/lib/errors/messages";
import { toApiError } from "@/lib/errors/normalize";
import { currenciesMapToArray } from "@/types";
import type {
  Currency,
  TimeSeriesResponse,
  SingleDateResponse,
  LatestRatesResponse,
} from "@/types";
import {
  calculateRangeTrend,
  calculateSingleDateDiff,
} from "@/lib/trend/calculations";

export type TrendMode = "range" | "single";

export interface TrendResult {
  code: string;
  name: string;
  deltaPct: number;
  avgDailyChangePct?: number;
  direction: "up" | "down" | "neutral";
  initialValue?: number;
  finalValue?: number;
}

interface UseTrendAnalysisParams {
  baseCurrency: string;
  mode: TrendMode;
  startDate: string;
  endDate: string;
  singleDate: string;
}

export function useTrendAnalysis({
  baseCurrency,
  mode,
  startDate,
  endDate,
  singleDate,
}: UseTrendAnalysisParams) {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<TrendResult[]>([]);

  useEffect(() => {
    const loadCurrencies = async () => {
      const response = await getCurrencies();
      if (!response.error && response.data) {
        setCurrencies(currenciesMapToArray(response.data));
      }
    };
    loadCurrencies();
  }, []);

  const processRangeData = (data: TimeSeriesResponse, currenciesList: Currency[]) => {
    const trendResults: TrendResult[] = [];
    const allTargets = new Set<string>();

    Object.values(data.rates).forEach((ratesForDate) => {
      Object.keys(ratesForDate).forEach((code) => {
        if (code !== baseCurrency) {
          allTargets.add(code);
        }
      });
    });

    for (const target of allTargets) {
      if (target === baseCurrency) continue;

      const dates = Object.keys(data.rates).sort();
      const series: number[] = [];

      for (const date of dates) {
        const rate = data.rates[date][target];
        if (rate !== undefined) {
          series.push(rate);
        }
      }

      if (series.length < 2) continue;

      const trend = calculateRangeTrend(series);
      if (!trend) continue;

      const currency = currenciesList.find((currencyItem) => currencyItem.code === target);
      const absDelta = Math.abs(trend.deltaPct);
      const direction = absDelta < 0.0001 ? "neutral" : trend.deltaPct > 0 ? "up" : "down";

      trendResults.push({
        code: target,
        name: currency?.name || target,
        deltaPct: trend.deltaPct,
        avgDailyChangePct: trend.avgDailyChangePct,
        direction,
        initialValue: series[0],
        finalValue: series[series.length - 1],
      });
    }

    setResults(trendResults);
  };

  const processSingleDateData = (
    selectedData: SingleDateResponse,
    todayData: LatestRatesResponse,
    currenciesList: Currency[]
  ) => {
    const trendResults: TrendResult[] = [];

    const selectedRates = selectedData.rates;
    const todayRates = todayData.rates;

    const allTargets = new Set([
      ...Object.keys(selectedRates),
      ...Object.keys(todayRates),
    ]);

    for (const target of allTargets) {
      if (target === baseCurrency) continue;

      const selectedRate = selectedRates[target];
      const todayRate = todayRates[target];

      if (selectedRate === undefined || todayRate === undefined) continue;

      const diff = calculateSingleDateDiff(selectedRate, todayRate);
      if (!diff) continue;

      const currency = currenciesList.find((currencyItem) => currencyItem.code === target);
      const absDelta = Math.abs(diff.deltaPct);
      const direction = absDelta < 0.0001 ? "neutral" : diff.deltaPct > 0 ? "up" : "down";

      trendResults.push({
        code: target,
        name: currency?.name || target,
        deltaPct: diff.deltaPct,
        direction,
        initialValue: selectedRate,
        finalValue: todayRate,
      });
    }

    setResults(trendResults);
  };

  const fetchTrendData = async () => {
    setLoading(true);
    setError(null);

    try {
      if (mode === "range") {
        const response = await getTimeSeries({
          start: startDate,
          end: endDate,
          from: baseCurrency,
        });
        if (response.error) {
          setError(getUserErrorMessage(response.error));
          setResults([]);
        } else {
          processRangeData(response.data, currencies);
        }
      } else {
        const [selectedResponse, todayResponse] = await Promise.all([
          getRatesByDate({
            date: singleDate,
            from: baseCurrency,
          }),
          getLatestRates({ from: baseCurrency }),
        ]);

        if (selectedResponse.error || todayResponse.error) {
          const apiError = selectedResponse.error || todayResponse.error;
          setError(apiError ? getUserErrorMessage(apiError) : "Unknown error");
          setResults([]);
        } else {
          processSingleDateData(selectedResponse.data, todayResponse.data, currencies);
        }
      }
    } catch (error) {
      const apiError = toApiError(error);
      setError(getUserErrorMessage(apiError));
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    currencies,
    loading,
    error,
    results,
    fetchTrendData,
  };
}

