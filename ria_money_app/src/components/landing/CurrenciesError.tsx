"use client";

import { ErrorState } from "@/components/common/ErrorState";
import styles from "./CurrenciesError.module.css";

interface CurrenciesErrorProps {
  error: string;
  onRetry: () => void;
}

export function CurrenciesError({ error, onRetry }: CurrenciesErrorProps) {
  return (
    <section className={styles.section} aria-label="Error loading currencies">
      <h2 className={styles.title}>We work with the following currencies</h2>
      <ErrorState
        message={error || "Could not load available currencies"}
        onRetry={onRetry}
      />
    </section>
  );
}

