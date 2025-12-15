import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { ExchangeRatesOverview } from "@/components/dashboard/ExchangeRatesOverview";
import { CurrencyConverter } from "@/components/dashboard/CurrencyConverter";
import { getLatestRates } from "@/api/exchangeRates";
import { getCurrencies } from "@/api/currencies";
import { currenciesMapToArray } from "@/types";
import styles from "./page.module.css";

async function fetchDashboardData() {
  try {
    const [ratesResponse, currenciesResponse] = await Promise.all([
      getLatestRates({}),
      getCurrencies(),
    ]);

    const rates = ratesResponse.error ? null : ratesResponse.data;
    const currencies = currenciesResponse.error
      ? []
      : currenciesMapToArray(currenciesResponse.data);

    return {
      rates,
      currencies,
      ratesError: ratesResponse.error,
      currenciesError: currenciesResponse.error,
    };
  } catch (error) {
    return {
      rates: null,
      currencies: [],
      ratesError: error instanceof Error ? error.message : "Error desconocido",
      currenciesError: null,
    };
  }
}

export default async function DashboardPage() {
  const { rates, currencies, ratesError, currenciesError } = await fetchDashboardData();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Container>
          <div className={styles.header}>
            <h1 className={styles.title}>Dashboard</h1>
            <p className={styles.subtitle}>
              Panel principal de conversión de moneda y tasas de cambio
            </p>
          </div>

          <div className={styles.grid}>
            <Card title="Currency Converter">
              {currencies.length > 0 ? (
                <CurrencyConverter initialCurrencies={currencies} />
              ) : currenciesError ? (
                <div className={styles.errorContainer}>
                  <p className={styles.errorMessage}>
                    {currenciesError || "No se pudieron cargar las monedas"}
                  </p>
                </div>
              ) : (
                <div className={styles.loading}>Cargando monedas...</div>
              )}
            </Card>

            <Card title="Exchange Rates Overview">
              {rates && currencies.length > 0 ? (
                <ExchangeRatesOverview initialRates={rates} initialCurrencies={currencies} />
              ) : ratesError ? (
                <div className={styles.errorContainer}>
                  <p className={styles.errorMessage}>
                    {ratesError || "No se pudieron cargar las tasas de cambio"}
                  </p>
                </div>
              ) : (
                <div className={styles.loading}>Cargando tasas de cambio...</div>
              )}
            </Card>
          </div>
        </Container>
      </main>
    </div>
  );
}

