"use client";

import { type Currency } from "@/types";
import styles from "./SupportedCurrencies.module.css";

interface SupportedCurrenciesProps {
  currencies: Currency[];
}

export function SupportedCurrencies({ currencies }: SupportedCurrenciesProps) {
  const duplicatedCurrencies = [...currencies, ...currencies];

  return (
    <section className={styles.section} aria-label="Supported currencies">
      <h2 className={styles.title}>We work with the following currencies</h2>
      <div className={styles.wrapper}>
        <div className={styles.scrollContainer}>
          <ul className={styles.currencyList}>
            {duplicatedCurrencies.map((currency, index) => (
              <li key={`${currency.code}-${index}`} className={styles.currencyItem}>
                <span className={styles.code}>{currency.code}</span>
                <span className={styles.name}>{currency.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

