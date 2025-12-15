import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { APP_NAME, APP_DESCRIPTION } from "@/constants/app";
import { SupportedCurrencies } from "@/components/landing/SupportedCurrencies";
import { CurrenciesLoading } from "@/components/landing/CurrenciesLoading";
import { CurrenciesError } from "@/components/landing/CurrenciesError";
import { getCurrencies } from "@/api/currencies";
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
      error: error instanceof Error ? error.message : "Error desconocido",
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
                Realiza conversiones de moneda y consulta tasas de cambio en tiempo real.
              </p>
              <Button href="/dashboard" variant="primary" size="lg">
                Ir al Dashboard
              </Button>
            </div>
            <div className={styles.features}>
              <div>
                <h3 className={styles.featureTitle}>Conversión en Tiempo Real</h3>
                <p className={styles.featureText}>
                  Obtén tasas de cambio actualizadas.
                </p>
              </div>
              <div>
                <h3 className={styles.featureTitle}>Fácil de Usar</h3>
                <p className={styles.featureText}>
                  Interfaz intuitiva que te permite convertir entre monedas con solo unos clics.
                </p>
              </div>
              <div>
                <h3 className={styles.featureTitle}>Datos Confiables</h3>
                <p className={styles.featureText}>
                  Información precisa obtenida de la{" "}
                  <a
                    href="https://frankfurter.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    API de Frankfurter
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
        <CurrenciesError error={error} onRetry={() => window.location.reload()} />
      ) : (
        <CurrenciesLoading />
      )}
    </div>
  );
}
