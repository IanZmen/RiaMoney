import { Container } from "./Container";
import { APP_NAME } from "@/constants/app";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.content}>
          <p>© {new Date().getFullYear()} {APP_NAME}</p>
        </div>
      </Container>
    </footer>
  );
}

