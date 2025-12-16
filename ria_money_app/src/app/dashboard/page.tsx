import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/common/ErrorState";
import { ExchangeRatesOverview } from "@/components/dashboard/ExchangeRatesOverview";
import { CurrencyConverter } from "@/components/dashboard/CurrencyConverter";
import { getLatestRates } from "@/api/exchangeRates";
import { getCurrencies } from "@/api/currencies";
import { getUserErrorMessage } from "@/lib/errors/messages";
import { toApiError } from "@/lib/errors/normalize";
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
      ratesError: error instanceof Error ? toApiError(error) : toApiError(new Error("Unknown error")),
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
              Main currency conversion and exchange rates panel
            </p>
          </div>

          <div className={styles.grid}>
            <Card title="Currency Converter">
              {currencies.length > 0 ? (
                <CurrencyConverter initialCurrencies={currencies} />
              ) : currenciesError ? (
                <ErrorState
                  message={getUserErrorMessage(currenciesError)}
                  compact
                />
              ) : (
                <div className={styles.loading}>Loading currencies...</div>
              )}
            </Card>

            <Card title="Exchange Rates Overview">
              {rates && currencies.length > 0 ? (
                <ExchangeRatesOverview initialRates={rates} initialCurrencies={currencies} />
              ) : ratesError ? (
                <ErrorState
                  message={getUserErrorMessage(ratesError)}
                  compact
                />
              ) : (
                <div className={styles.loading}>Loading exchange rates...</div>
              )}
            </Card>
          </div>
        </Container>
      </main>
    </div>
  );
}

