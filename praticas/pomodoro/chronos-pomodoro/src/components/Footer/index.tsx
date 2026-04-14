import styles from './styles.module.css';

type GenericHtmlProps = {
  children: React.ReactNode;
};

export function Footer({ children }: GenericHtmlProps) {
  return <div className={styles.genericHtml}>{children}</div>;
}