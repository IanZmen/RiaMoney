"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { getLatestRates } from "@/api/exchangeRates";
import type { Currency, LatestRatesResponse } from "@/types";
import styles from "./CurrencyConverter.module.css";

interface CurrencyConverterProps {
  initialCurrencies: Currency[];
}

export function CurrencyConverter({ initialCurrencies }: CurrencyConverterProps) {
  const [amount, setAmount] = useState<number | "">("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState<string[]>([]);
  const [selectedToAdd, setSelectedToAdd] = useState("");
  const [ratesData, setRatesData] = useState<LatestRatesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (to.length === 0 || !from) {
      setRatesData(null);
      return;
    }

    const fetchRates = async () => {
      setLoading(true);
      setError(null);

      const response = await getLatestRates({ from, to });
      if (response.error) {
        setError(response.error);
        setRatesData(null);
      } else {
        setRatesData(response.data);
      }
      setLoading(false);
    };

    fetchRates();
  }, [from, to]);

  const handleAddCurrency = () => {
    if (!selectedToAdd || !from || selectedToAdd === from) {
      return;
    }
    if (!to.includes(selectedToAdd)) {
      setTo([...to, selectedToAdd]);
    }
    setSelectedToAdd("");
  };

  const handleRemoveCurrency = (code: string) => {
    setTo(to.filter((c) => c !== code));
  };

  const handleFromChange = (newFrom: string) => {
    setFrom(newFrom);
    setTo(to.filter((c) => c !== newFrom));
  };

  const formatMoney = (value: number, currencyCode: string): string => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    } catch {
      return `${value.toFixed(2)} ${currencyCode}`;
    }
  };

  const getCurrencyName = (code: string): string => {
    const currency = initialCurrencies.find((c) => c.code === code);
    return currency?.name || code;
  };

  const availableToCurrencies = initialCurrencies.filter(
    (c) => c.code !== from && !to.includes(c.code)
  );

  const currencyOptions = initialCurrencies.map((currency) => ({
    value: currency.code,
    label: `${currency.code} - ${currency.name}`,
  }));

  const toCurrencyOptions = [
    { value: "", label: "Selecciona una moneda" },
    ...availableToCurrencies.map((currency) => ({
      value: currency.code,
      label: `${currency.code} - ${currency.name}`,
    })),
  ];

  const numericAmount = typeof amount === "number" ? amount : 0;

  const handleRetry = async () => {
    if (to.length === 0) return;

    setLoading(true);
    setError(null);

    const response = await getLatestRates({ from, to });
    if (response.error) {
      setError(response.error);
      setRatesData(null);
    } else {
      setRatesData(response.data);
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.amountInput}>
          <Input
            label="Monto"
            type="number"
            value={amount}
            onChange={(e) => {
              const value = e.target.value;
              setAmount(value === "" ? "" : parseFloat(value) || 0);
            }}
            min="0"
            step="0.01"
            placeholder="Ingresa el monto"
          />
        </div>

        <Select
          label="Moneda origen"
          options={[{ value: "", label: "Selecciona una moneda" }, ...currencyOptions]}
          value={from}
          onChange={(e) => handleFromChange(e.target.value)}
          className={styles.select}
        />

        <div className={styles.toSection}>
          <div className={styles.toHeader}>
            <Select
              label="Agregar moneda destino"
              options={toCurrencyOptions}
              value={selectedToAdd}
              onChange={(e) => setSelectedToAdd(e.target.value)}
              className={styles.toSelect}
            />
            <Button
              onClick={handleAddCurrency}
              variant="primary"
              size="sm"
              disabled={!selectedToAdd || !from || selectedToAdd === from}
              className={styles.addButton}
            >
              Agregar
            </Button>
          </div>

          {to.length > 0 && (
            <div className={styles.selectedCurrencies}>
              {to.map((code) => (
                <div key={code} className={styles.currencyTag}>
                  <span>{code}</span>
                  <button
                    onClick={() => handleRemoveCurrency(code)}
                    className={styles.removeButton}
                    aria-label={`Remover ${code}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {error ? (
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>{error}</p>
          <Button onClick={handleRetry} variant="primary" size="sm">
            Reintentar
          </Button>
        </div>
      ) : loading ? (
        <div className={styles.loading}>Cargando tasas...</div>
      ) : !from ? (
        <div className={styles.hint}>
          Selecciona una moneda origen para comenzar
        </div>
      ) : to.length === 0 ? (
        <div className={styles.hint}>
          Selecciona al menos una moneda destino para ver las conversiones
        </div>
      ) : ratesData ? (
        <div className={styles.results}>
          <div className={styles.meta}>
            <span className={styles.metaText}>
              Base: <strong>{ratesData.base}</strong> • Fecha: <strong>{ratesData.date}</strong>
            </span>
          </div>

          <div className={styles.resultsList}>
            {to.map((code) => {
              const rate = ratesData.rates[code];
              if (!rate) return null;
              const converted = numericAmount * rate;

              return (
                <div key={code} className={styles.resultCard}>
                  <div className={styles.resultHeader}>
                    <span className={styles.resultCode}>{code}</span>
                    <span className={styles.resultName}>{getCurrencyName(code)}</span>
                  </div>
                  <div className={styles.resultValue}>
                    {formatMoney(converted, code)}
                  </div>
                  <div className={styles.resultRate}>
                    Tasa: {rate.toFixed(5)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

