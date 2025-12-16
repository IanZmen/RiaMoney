"use client";

import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/common/ErrorState";
import { TrendControls } from "@/components/trend/TrendControls";
import { TrendResults } from "@/components/trend/TrendResults";
import { useTrendAnalysis, type TrendMode } from "@/hooks/useTrendAnalysis";
import styles from "./page.module.css";

export default function TrendPage() {
  const today = new Date().toISOString().split("T")[0];
  const minDate = "2021-01-01";

  const [baseCurrency, setBaseCurrency] = useState("EUR");
  const [mode, setMode] = useState<TrendMode>("range");
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState(today);
  const [singleDate, setSingleDate] = useState("2024-01-15");

  const { currencies, loading, error, results, fetchTrendData } = useTrendAnalysis({
    baseCurrency,
    mode,
    startDate,
    endDate,
    singleDate,
  });

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Container>
          <div className={styles.header}>
            <h1 className={styles.title}>Currency Trends</h1>
            <p className={styles.subtitle}>
              Analyze historical exchange rate trends and compare rates across different dates
            </p>
          </div>

          <Card title="Trend Analysis">
            <TrendControls
              baseCurrency={baseCurrency}
              mode={mode}
              startDate={startDate}
              endDate={endDate}
              singleDate={singleDate}
              minDate={minDate}
              maxDate={today}
              currencies={currencies}
              loading={loading}
              onBaseCurrencyChange={setBaseCurrency}
              onModeChange={setMode}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onSingleDateChange={setSingleDate}
              onUpdate={fetchTrendData}
            />

            {error && (
              <ErrorState message={error} onRetry={fetchTrendData} compact />
            )}

            {!loading && !error && results.length === 0 && (
              <div className={styles.hint}>
                Click "Update" to load trend data for the selected date range.
              </div>
            )}

            {results.length > 0 && <TrendResults results={results} mode={mode} />}
          </Card>
        </Container>
      </main>
    </div>
  );
}
