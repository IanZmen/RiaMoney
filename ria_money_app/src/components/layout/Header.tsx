import Link from "next/link";
import { APP_NAME } from "@/constants/app";
import { Container } from "./Container";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.content}>
          <Link href="/" className={styles.logo}>
            {APP_NAME}
          </Link>
          <nav className={styles.nav}>
            <Link href="/" className={styles.navLink}>
              Landing
            </Link>
            <Link href="/dashboard" className={styles.navLink}>
              Dashboard
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  );
}

