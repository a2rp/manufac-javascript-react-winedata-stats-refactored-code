import { useEffect, useMemo, useState } from "react";
import {
  FaChartBar,
  FaCode,
  FaDatabase,
  FaGithub,
} from "react-icons/fa";
import { FiArrowUp, FiBookOpen, FiExternalLink, FiMenu, FiX } from "react-icons/fi";
import styles from "./App.module.scss";
import { wineDataSet } from "./files/wineDataSet";

const groupBy = (items, key) =>
  items.reduce((groups, item) => {
    const groupKey = item[key];
    groups[groupKey] = groups[groupKey] || [];
    groups[groupKey].push(item);
    return groups;
  }, {});

const mean = (values) => values.reduce((total, value) => total + value, 0) / values.length;

const median = (values) => {
  const sortedValues = [...values].sort((first, second) => first - second);
  const middle = Math.floor(sortedValues.length / 2);
  return sortedValues.length % 2 === 0
    ? (sortedValues[middle - 1] + sortedValues[middle]) / 2
    : sortedValues[middle];
};

const mode = (values) => {
  const counts = new Map();
  let mostCommon = values[0];
  let highestCount = 0;

  values.forEach((value) => {
    const count = (counts.get(value) || 0) + 1;
    counts.set(value, count);
    if (count > highestCount) {
      mostCommon = value;
      highestCount = count;
    }
  });

  return mostCommon;
};

const formatValue = (value) => Number(value).toFixed(3);

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);

  const statistics = useMemo(() => {
    const groupedData = groupBy(wineDataSet, "Alcohol");

    return Object.entries(groupedData).map(([alcoholClass, rows]) => {
      const flavanoids = rows.map((row) => Number(row.Flavanoids));
      const gamma = rows.map(
        (row) => (Number(row.Ash) * Number(row.Hue)) / Number(row.Magnesium)
      );

      return {
        alcoholClass,
        sampleCount: rows.length,
        flavanoids: {
          mean: formatValue(mean(flavanoids)),
          median: formatValue(median(flavanoids)),
          mode: formatValue(mode(flavanoids)),
        },
        gamma: {
          mean: formatValue(mean(gamma)),
          median: formatValue(median(gamma)),
          mode: formatValue(mode(gamma)),
        },
      };
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowTopButton(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className={styles.appShell}>
      <header className={styles.header}>
        <a className={styles.brand} href="#top" onClick={closeMobileMenu} aria-label="Wine data statistics home">
          <img src={process.env.PUBLIC_URL + "/logo.png"} alt="Ashish Ranjan logo" />
          <span>
            <small>Data exploration</small>
            <strong>Wine Statistics</strong>
          </span>
        </a>

        <button
          className={styles.menuButton}
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-expanded={mobileMenuOpen}
          aria-controls="main-navigation"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
        </button>

        <nav id="main-navigation" className={styles.navigation + (mobileMenuOpen ? " " + styles.navigationOpen : "")} aria-label="Main navigation">
          <a href="#statistics" onClick={closeMobileMenu}><FaChartBar aria-hidden="true" /> Statistics</a>
          <a href="#method" onClick={closeMobileMenu}><FiBookOpen aria-hidden="true" /> Method</a>
          <a href="https://github.com/a2rp/manufac-javascript-react-winedata-stats-refactored-code" target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu}><FaGithub aria-hidden="true" /> Source</a>
        </nav>
      </header>

      <main id="top">
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>React data view</p>
            <h1>Wine data, made easier to compare.</h1>
            <p className={styles.intro}>
              Explore grouped flavanoids and gamma statistics across the wine dataset.
              The calculations stay in JavaScript while the interface keeps the results easy to scan.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primaryAction} href="#statistics"><FaChartBar aria-hidden="true" /> View statistics</a>
              <a className={styles.secondaryAction} href="#method"><FiExternalLink aria-hidden="true" /> See the method</a>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <img src={process.env.PUBLIC_URL + "/preview.png"} alt="Wine statistics dashboard preview" />
            <div className={styles.visualBadge}><FaDatabase aria-hidden="true" /> Local dataset</div>
          </div>
        </section>

        <section className={styles.summaryGrid} aria-label="Dataset summary">
          <article><FaDatabase aria-hidden="true" /><strong>{wineDataSet.length}</strong><span>Wine records</span></article>
          <article><FaChartBar aria-hidden="true" /><strong>{statistics.length}</strong><span>Alcohol classes</span></article>
          <article><FaCode aria-hidden="true" /><strong>6</strong><span>Measures shown</span></article>
        </section>

        <section id="statistics" className={styles.statisticsSection} aria-labelledby="statistics-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Results</p>
              <h2 id="statistics-title">Grouped statistical measures</h2>
            </div>
            <p>Each column represents one alcohol class in the source dataset.</p>
          </div>

          <div className={styles.tableGrid}>
            <article className={styles.tableCard}>
              <div className={styles.tableTitle}><FaChartBar aria-hidden="true" /><h3>Flavanoids</h3></div>
              <div className={styles.tableScroll}>
                <table>
                  <thead><tr><th>Measure</th>{statistics.map(({ alcoholClass }) => <th key={alcoholClass}>Class {alcoholClass}</th>)}</tr></thead>
                  <tbody>
                    {["mean", "median", "mode"].map((measure) => (
                      <tr key={measure}><th scope="row">{measure[0].toUpperCase() + measure.slice(1)}</th>{statistics.map((item) => <td key={item.alcoholClass}>{item.flavanoids[measure]}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className={styles.tableCard}>
              <div className={styles.tableTitle}><FaDatabase aria-hidden="true" /><h3>Gamma</h3></div>
              <div className={styles.tableScroll}>
                <table>
                  <thead><tr><th>Measure</th>{statistics.map(({ alcoholClass }) => <th key={alcoholClass}>Class {alcoholClass}</th>)}</tr></thead>
                  <tbody>
                    {["mean", "median", "mode"].map((measure) => (
                      <tr key={measure}><th scope="row">{measure[0].toUpperCase() + measure.slice(1)}</th>{statistics.map((item) => <td key={item.alcoholClass}>{item.gamma[measure]}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          </div>
        </section>

        <section id="method" className={styles.methodSection} aria-labelledby="method-title">
          <div>
            <p className={styles.eyebrow}>How it is calculated</p>
            <h2 id="method-title">One dataset, two useful views.</h2>
          </div>
          <div className={styles.methodCards}>
            <article><span>01</span><h3>Group by alcohol</h3><p>Rows are grouped using the Alcohol field before any summary is calculated.</p></article>
            <article><span>02</span><h3>Summarize values</h3><p>Mean, median and mode are calculated for Flavanoids and the derived Gamma value.</p></article>
            <article><span>03</span><h3>Compare classes</h3><p>The result is rendered as responsive tables so each class is easy to compare.</p></article>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div>
            <p className={styles.eyebrow}>Built for learning</p>
            <p className={styles.footerText}>A practical React view for exploring small datasets.</p>
          </div>
          <nav className={styles.socialLinks} aria-label="Project links">
            <a href="https://github.com/a2rp/manufac-javascript-react-winedata-stats-refactored-code" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub"><FaGithub aria-hidden="true" /><span className={styles.srOnly}>GitHub</span></a>
            <a href="https://www.ashishranjan.net/" target="_blank" rel="noopener noreferrer" aria-label="Portfolio" title="Portfolio"><FaCode aria-hidden="true" /><span className={styles.srOnly}>Portfolio</span></a>
          </nav>
        </div>
        <div className={styles.footerBottom}>
          Copyright © {new Date().getFullYear()}{" "}
          <a href="https://www.ashishranjan.net" target="_blank" rel="noopener noreferrer">Ashish Ranjan</a>
        </div>
      </footer>

      <button className={styles.topButton + " " + (showTopButton ? styles.topButtonVisible : "")} type="button" onClick={scrollToTop} aria-label="Go to top">
        <FiArrowUp aria-hidden="true" />
      </button>
    </div>
  );
}

export default App;
