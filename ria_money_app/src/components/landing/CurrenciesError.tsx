"use client";

import { Button } from "@/components/ui/Button";
import styles from "./CurrenciesError.module.css";

interface CurrenciesErrorProps {
  error: string;
  onRetry: () => void;
}

export function CurrenciesError({ error, onRetry }: CurrenciesErrorProps) {
  return (
    <section className={styles.section} aria-label="Error al cargar monedas">
      <h2 className={styles.title}>Trabajamos con las siguientes monedas</h2>
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>
          {error || "No se pudieron cargar las monedas disponibles"}
        </p>
        <Button onClick={onRetry} variant="primary">
          Reintentar
        </Button>
      </div>
    </section>
  );
}

