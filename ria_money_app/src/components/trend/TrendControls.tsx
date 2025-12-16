import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { Currency } from "@/types";
import type { TrendMode } from "@/hooks/useTrendAnalysis";
import styles from "./TrendControls.module.css";

interface TrendControlsProps {
  baseCurrency: string;
  mode: TrendMode;
  startDate: string;
  endDate: string;
  singleDate: string;
  minDate: string;
  maxDate: string;
  currencies: Currency[];
  loading: boolean;
  onBaseCurrencyChange: (value: string) => void;
  onModeChange: (mode: TrendMode) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onSingleDateChange: (date: string) => void;
  onUpdate: () => void;
}

export function TrendControls({
  baseCurrency,
  mode,
  startDate,
  endDate,
  singleDate,
  minDate,
  maxDate,
  currencies,
  loading,
  onBaseCurrencyChange,
  onModeChange,
  onStartDateChange,
  onEndDateChange,
  onSingleDateChange,
  onUpdate,
}: TrendControlsProps) {
  const currencyOptions = currencies.map((currency) => ({
    value: currency.code,
    label: `${currency.code} - ${currency.name}`,
  }));

  return (
    <div className={styles.controls}>
      <Select
        label="Base currency"
        options={currencyOptions}
        value={baseCurrency}
        onChange={(event) => onBaseCurrencyChange(event.target.value)}
        className={styles.select}
      />

      <div className={styles.modeToggle}>
        <button
          className={`${styles.modeButton} ${mode === "range" ? styles.active : ""}`}
          onClick={() => onModeChange("range")}
        >
          Date Range
        </button>
        <button
          className={`${styles.modeButton} ${mode === "single" ? styles.active : ""}`}
          onClick={() => onModeChange("single")}
        >
          Single Date
        </button>
      </div>

      {mode === "range" ? (
        <div className={styles.dateInputs}>
          <Input
            label="Start date"
            type="date"
            value={startDate}
            onChange={(event) => {
              const newStart = event.target.value;
              if (newStart >= minDate && newStart <= maxDate) {
                onStartDateChange(newStart);
                if (newStart > endDate) {
                  onEndDateChange(newStart);
                }
              }
            }}
            min={minDate}
            max={maxDate}
            className={styles.dateInput}
          />
          <Input
            label="End date"
            type="date"
            value={endDate}
            onChange={(event) => {
              const newEnd = event.target.value;
              if (newEnd >= startDate && newEnd <= maxDate) {
                onEndDateChange(newEnd);
              }
            }}
            min={startDate}
            max={maxDate}
            className={styles.dateInput}
          />
        </div>
      ) : (
        <Input
          label="Date"
          type="date"
          value={singleDate}
          onChange={(event) => {
            const newDate = event.target.value;
            if (newDate >= minDate && newDate <= maxDate) {
              onSingleDateChange(newDate);
            }
          }}
          min={minDate}
          max={maxDate}
          className={styles.dateInput}
        />
      )}

      <Button onClick={onUpdate} variant="primary" size="lg" disabled={loading}>
        {loading ? "Loading..." : "Update"}
      </Button>
    </div>
  );
}

