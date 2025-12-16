import { useState } from "react";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { TrendResult, TrendMode } from "@/hooks/useTrendAnalysis";
import styles from "./TrendResults.module.css";

type SortOrder = "highest" | "lowest" | "alphabetical";

interface TrendResultsProps {
  results: TrendResult[];
  mode: TrendMode;
}

export function TrendResults({ results, mode }: TrendResultsProps) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("highest");
  const [showAll, setShowAll] = useState(false);

  const sortedResults = [...results].sort((a, b) => {
    if (sortOrder === "highest") {
      return b.deltaPct - a.deltaPct;
    } else if (sortOrder === "lowest") {
      return a.deltaPct - b.deltaPct;
    } else {
      return a.code.localeCompare(b.code);
    }
  });

  const displayedResults = showAll ? sortedResults : sortedResults.slice(0, 12);

  return (
    <div className={styles.results}>
      <div className={styles.resultsHeader}>
        <Select
          label="Sort by"
          options={[
            { value: "highest", label: "Highest increase" },
            { value: "lowest", label: "Highest decrease" },
            { value: "alphabetical", label: "Alphabetical" },
          ]}
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value as SortOrder)}
          className={styles.sortSelect}
        />
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.legendSign}>+</span>
          <span className={styles.legendText}>Base is more expensive (stronger)</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendSign}>−</span>
          <span className={styles.legendText}>Base is cheaper (weaker)</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendSign}>0</span>
          <span className={styles.legendText}>No significant change</span>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Initial</th>
              <th>Final</th>
              <th>Change</th>
              <th>%</th>
              {mode === "range" && <th>Avg Daily %</th>}
            </tr>
          </thead>
          <tbody>
            {displayedResults.map((result) => (
              <tr key={result.code}>
                <td className={styles.code}>{result.code}</td>
                <td className={styles.name}>{result.name}</td>
                <td className={styles.value}>
                  {result.initialValue !== undefined
                    ? result.initialValue.toFixed(5)
                    : "N/A"}
                </td>
                <td className={styles.value}>
                  {result.finalValue !== undefined
                    ? result.finalValue.toFixed(5)
                    : "N/A"}
                </td>
                <td className={styles.direction}>
                  {result.direction === "up" && "+"}
                  {result.direction === "down" && "−"}
                  {result.direction === "neutral" && "0"}
                </td>
                <td
                  className={`${styles.percentage} ${
                    result.direction === "up"
                      ? styles.positive
                      : result.direction === "down"
                        ? styles.negative
                        : ""
                  }`}
                >
                  {(result.deltaPct * 100).toFixed(2)}%
                </td>
                {mode === "range" && (
                  <td className={styles.avgDaily}>
                    {result.avgDailyChangePct !== undefined
                      ? (result.avgDailyChangePct * 100).toFixed(4) + "%"
                      : "N/A"}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {results.length > 12 && (
        <div className={styles.showAllContainer}>
          <Button
            onClick={() => setShowAll(!showAll)}
            variant="outline"
            size="sm"
          >
            {showAll ? "Show top 12" : `Show all (${results.length})`}
          </Button>
        </div>
      )}

      <p className={styles.disclaimer}>
        Indicator based on historical data; does not predict the future.
      </p>
    </div>
  );
}

