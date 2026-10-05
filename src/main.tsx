import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
function App() {
  const [version, setVersion] = useState('Loading…');
  useEffect(() => { if (window.sqlCockpit) window.sqlCockpit.getVersion().then(setVersion).catch(() => setVersion('Unavailable')); else setVersion('Browser preview'); }, []);
  return <main id="main-content">
    <header><a className="brand" href="#main-content"><span className="brand-icon" aria-hidden="true">SQL</span> SQL Cockpit <span className="app-label">App</span></a><span className="test-pill">TEST BUILD</span></header>
    <section className="intro"><p className="eyebrow">YOUR DATABASE WORKSPACE · DESKTOP</p><h1>One workspace.<br /><span>Every desktop.</span></h1><p className="lead">A first look at SQL Cockpit App for Windows, Mac and Linux. Built from one Electron package, with one shared release version.</p></section>
    <section className="release-card" aria-labelledby="release-title"><div className="release-icon" aria-hidden="true">↗</div><div><p className="eyebrow">INITIAL DESKTOP RELEASE</p><h2 id="release-title">Release integration test</h2><p>This placeholder verifies installers, version information and GitHub release notes. It does not connect to databases.</p></div><div className="version-block"><span>Installed version</span><strong data-testid="installed-version">{version}</strong></div></section>
    <section className="features" aria-label="Test build details"><article><span className="number">01</span><h2>Shared version</h2><p>Windows, Mac and Linux use the same app package and release history.</p></article><article><span className="number">02</span><h2>Platform installers</h2><p>Windows x64, Mac Apple Silicon, Mac Intel and Linux x64 have separate downloads.</p></article><article><span className="number">03</span><h2>Public release notes</h2><p>GitHub Releases provide the version, changes and installer assets for the website.</p></article></section>
    <footer><p><strong>For testing only.</strong> Not production-ready. No account login, database access or automatic updates.</p><p>Windows and Linux builds are unsigned. Mac builds use ad-hoc signing and are not notarized or signed with a Developer ID.</p></footer>
  </main>;
}
createRoot(document.getElementById('root')!).render(<App />);
