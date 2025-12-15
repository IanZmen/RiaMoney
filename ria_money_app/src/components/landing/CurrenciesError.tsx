"use client";

import { Button } from "@/components/ui/Button";
import styles from "./CurrenciesError.module.css";

interface CurrenciesErrorProps {
  error: string;
  onRetry: () => void;
}

export function CurrenciesError({ error, onRetry }: CurrenciesErrorProps) {
  return (
    <section className={styles.section} aria-label="Error loading currencies">
      <h2 className={styles.title}>We work with the following currencies</h2>
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>
          {error || "Could not load available currencies"}
        </p>
        <Button onClick={onRetry} variant="primary">
          Retry
        </Button>
      </div>
    </section>
  );
}

