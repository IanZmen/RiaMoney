"use client";

import { useState, useEffect } from "react";
import { Select } from "@/components/ui/Select";
import { ErrorState } from "@/components/common/ErrorState";
import { getLatestRates } from "@/api/exchangeRates";
import { getUserErrorMessage } from "@/lib/errors/messages";
import type { Currency, LatestRatesResponse } from "@/types";
import { MAJOR_CURRENCIES } from "@/constants/majorCurrencies";
import styles from "./ExchangeRatesOverview.module.css";

interface ExchangeRatesOverviewProps {
  initialRates: LatestRatesResponse;
  initialCurrencies: Currency[];
}

export function ExchangeRatesOverview({
  initialRates,
  initialCurrencies,
}: ExchangeRatesOverviewProps) {
  const [baseCurrency, setBaseCurrency] = useState(initialRates.base);
  const [rates, setRates] = useState<LatestRatesResponse>(initialRates);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currencies, setCurrencies] = useState<Currency[]>(initialCurrencies);

  useEffect(() => {
    if (baseCurrency === initialRates.base) {
      return;
    }

    const fetchRates = async () => {
      setLoading(true);
      setError(null);

      const response = await getLatestRates({ from: baseCurrency });
      if (response.error) {
        setError(getUserErrorMessage(response.error));
      } else {
        setRates(response.data);
      }
      setLoading(false);
    };

    fetchRates();
  }, [baseCurrency, initialRates.base]);

  const handleRetry = async () => {
    setLoading(true);
    setError(null);

    const response = await getLatestRates({ from: baseCurrency });
    if (response.error) {
      setError(getUserErrorMessage(response.error));
    } else {
      setRates(response.data);
    }
    setLoading(false);
  };

  const currencyOptions = currencies.map((currency) => ({
    value: currency.code,
    label: `${currency.code} - ${currency.name}`,
  }));

  const filteredRates = Object.entries(rates.rates)
    .filter(([code]) => MAJOR_CURRENCIES.includes(code as typeof MAJOR_CURRENCIES[number]))
    .filter(([code]) => code !== baseCurrency)
    .slice(0, 10);

  const duplicatedRates = [...filteredRates, ...filteredRates];

  const formatRate = (rate: number): string => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 5,
    }).format(rate);
  };

  const getCurrencyName = (code: string): string => {
    const currency = currencies.find((currencyItem) => currencyItem.code === code);
    return currency?.name || code;
  };

  if (error) {
    return <ErrorState message={error} onRetry={handleRetry} compact />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Select
          label="Base currency"
          options={currencyOptions}
          value={baseCurrency}
          onChange={(event) => setBaseCurrency(event.target.value)}
          className={styles.select}
        />
        <div className={styles.meta}>
          <span className={styles.metaText}>
            Base: <strong>{baseCurrency}</strong> • Date: <strong>{rates.date}</strong>
          </span>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading rates...</div>
      ) : (
        <div className={styles.scrollWrapper}>
          <div className={styles.scrollContainer}>
            <ul className={styles.ratesList}>
              {duplicatedRates.map(([code, rate], index) => (
                <li key={`${code}-${index}`} className={styles.rateItem}>
                  <div className={styles.rateRow}>
                    <div className={styles.rateInfo}>
                      <span className={styles.code}>{code}</span>
                      <span className={styles.name}>{getCurrencyName(code)}</span>
                    </div>
                    <span className={styles.rate}>{formatRate(rate)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

