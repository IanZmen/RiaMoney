import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { APP_NAME, APP_DESCRIPTION } from "@/constants/app";
import { SupportedCurrencies } from "@/components/landing/SupportedCurrencies";
import { CurrenciesLoading } from "@/components/landing/CurrenciesLoading";
import { CurrenciesError } from "@/components/landing/CurrenciesError";
import { getCurrencies } from "@/api/currencies";
import { toApiError } from "@/lib/errors/normalize";
import { getUserErrorMessage } from "@/lib/errors/messages";
import { currenciesMapToArray } from "@/types";
import styles from "./page.module.css";

async function fetchCurrencies() {
  try {
    const response = await getCurrencies();
    if (response.error) {
      return { currencies: null, error: response.error };
    }
    return { currencies: currenciesMapToArray(response.data), error: null };
  } catch (error) {
    return {
      currencies: null,
      error: error instanceof Error ? toApiError(error) : toApiError(new Error("Unknown error")),
    };
  }
}

export default async function Home() {
  const { currencies, error } = await fetchCurrencies();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Container>
          <div className={styles.content}>
            <div className={styles.hero}>
              <h1 className={styles.title}>{APP_NAME}</h1>
              <p className={styles.subtitle}>{APP_DESCRIPTION}</p>
              <p className={styles.description}>
                Perform currency conversions and check exchange rates in real time.
              </p>
              <div className={styles.buttons}>
                <Button href="/dashboard" variant="primary" size="lg">
                  Go to Dashboard
                </Button>
                <Button href="/trend" variant="outline" size="lg">
                  View Trends
                </Button>
              </div>
            </div>
            <div className={styles.features}>
              <div>
                <h3 className={styles.featureTitle}>Real-Time Conversion</h3>
                <p className={styles.featureText}>
                  Get up-to-date exchange rates.
                </p>
              </div>
              <div>
                <h3 className={styles.featureTitle}>Easy to Use</h3>
                <p className={styles.featureText}>
                  Intuitive interface that allows you to convert between currencies with just a few clicks.
                </p>
              </div>
              <div>
                <h3 className={styles.featureTitle}>Trend Analysis</h3>
                <p className={styles.featureText}>
                  Analyze historical exchange rate trends and compare rates across different dates.
                </p>
              </div>
              <div>
                <h3 className={styles.featureTitle}>Reliable Data</h3>
                <p className={styles.featureText}>
                  Accurate information obtained from the{" "}
                  <a
                    href="https://frankfurter.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    Frankfurter API
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </Container>
      </main>

      {currencies ? (
        <SupportedCurrencies currencies={currencies} />
      ) : error ? (
        <CurrenciesError error={getUserErrorMessage(error)} onRetry={() => window.location.reload()} />
      ) : (
        <CurrenciesLoading />
      )}
    </div>
  );
}
