import styles from "./CurrenciesLoading.module.css";

export function CurrenciesLoading() {
  return (
    <section className={styles.section} aria-label="Cargando monedas">
      <h2 className={styles.title}>Trabajamos con las siguientes monedas</h2>
      <div className={styles.wrapper}>
        <div className={styles.skeletonGrid}>
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className={styles.skeletonItem}>
              <div className={styles.skeletonCode}></div>
              <div className={styles.skeletonName}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

