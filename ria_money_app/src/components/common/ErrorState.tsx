import { Button } from "@/components/ui/Button";
import styles from "./ErrorState.module.css";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  compact?: boolean;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  compact = false,
}: ErrorStateProps) {
  return (
    <div className={`${styles.container} ${compact ? styles.compact : ""}`}>
      <div className={styles.icon}>⚠️</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary" size="sm">
          Retry
        </Button>
      )}
    </div>
  );
}

