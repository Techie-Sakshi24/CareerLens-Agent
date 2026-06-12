import { useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const STEPS = [
  { id: 1, label: "Extract JD requirements" },
  { id: 2, label: "Match resume to role" },
  { id: 3, label: "Generate resume bullets" },
  { id: 4, label: "Write outreach message" },
];

export default function App() {
  const [jd, setJd] = useState("");
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function runAnalysis() {
    if (!jd.trim() || !resume.trim()) {
      setError("Paste both the job description and your resume to continue.");
      return;
    }

    setError("");
    setResult(null);
    setLoading(true);
    setCurrentStep(1);

    // Simulate step progress visually
    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 3500);

    try {
      const res = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: jd, resumeText: resume }),
      });

      const data = await res.json();
      clearInterval(stepTimer);
      setCurrentStep(4);

      if (!data.success) {
        setError(data.error || "Something went wrong.");
      } else {
        setResult(data.steps);
      }
    } catch (err) {
      clearInterval(stepTimer);
      setError("Could not reach the server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <span style={styles.logo}>CareerLens</span>
          <span style={styles.badge}>Agents League Hackathon · Microsoft Foundry IQ</span>
        </div>
      </header>

      <main style={styles.main}>
        {!result && (
          <>
            <div style={styles.hero}>
              <h1 style={styles.heroTitle}>Know exactly where you stand.</h1>
              <p style={styles.heroSub}>
                Paste a job description and your resume. The agent reads both, finds the gap, and tells you what to do about it.
              </p>
            </div>

            <div style={styles.inputGrid}>
              <div style={styles.inputBlock}>
                <label style={styles.label}>Job Description</label>
                <textarea
                  style={styles.textarea}
                  placeholder="Paste the full job description here..."
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                />
              </div>
              <div style={styles.inputBlock}>
                <label style={styles.label}>Your Resume</label>
                <textarea
                  style={styles.textarea}
                  placeholder="Paste your resume text here..."
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                />
              </div>
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <button
              style={loading ? { ...styles.btn, opacity: 0.6 } : styles.btn}
              onClick={runAnalysis}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze →"}
            </button>

            {loading && (
              <div style={styles.steps}>
                {STEPS.map((step) => (
                  <div key={step.id} style={styles.step}>
                    <span
                      style={{
                        ...styles.stepDot,
                        background: currentStep >= step.id ? "#6366f1" : "#e5e7eb",
                      }}
                    />
                    <span
                      style={{
                        ...styles.stepLabel,
                        color: currentStep >= step.id ? "#111" : "#9ca3af",
                        fontWeight: currentStep === step.id ? 600 : 400,
                      }}
                    >
                      {step.label}
                      {currentStep === step.id && " ..."}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {result && (
          <div style={styles.results}>
            <div style={styles.resultsHeader}>
              <h2 style={styles.resultsTitle}>Analysis complete</h2>
              <button style={styles.resetBtn} onClick={() => setResult(null)}>
                ← Analyze another
              </button>
            </div>

            {/* Match Score */}
            <div style={styles.scoreCard}>
              <div style={styles.scoreNum}>{result.matchResult.overall_match_score}%</div>
              <div style={styles.scoreLabel}>match score</div>
              <p style={styles.scoreSummary}>{result.matchResult.match_summary}</p>
            </div>

            {/* Skills breakdown */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Where you're strong</h3>
              {result.matchResult.strong_matches.map((m, i) => (
                <div key={i} style={styles.skillRow}>
                  <span style={styles.skillName}>{m.skill}</span>
                  <span style={styles.skillEvidence}>{m.evidence}</span>
                </div>
              ))}
            </div>

            {result.matchResult.partial_matches.length > 0 && (
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Close but not quite</h3>
                {result.matchResult.partial_matches.map((m, i) => (
                  <div key={i} style={styles.skillRow}>
                    <span style={styles.skillName}>{m.skill}</span>
                    <span style={styles.skillGap}>{m.gap}</span>
                  </div>
                ))}
              </div>
            )}

            {result.matchResult.missing_skills.length > 0 && (
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Gaps to address</h3>
                <div style={styles.tagRow}>
                  {result.matchResult.missing_skills.map((s, i) => (
                    <span key={i} style={styles.tag}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Resume bullets */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Resume bullets for this role</h3>
                <button
                  style={styles.copyBtn}
                  onClick={() => copyToClipboard(result.bullets.bullets.join("\n"))}
                >
                  Copy all
                </button>
              </div>
              {result.bullets.bullets.map((b, i) => (
                <p key={i} style={styles.bullet}>• {b}</p>
              ))}
            </div>

            {/* Outreach */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Cold outreach message</h3>
                <button
                  style={styles.copyBtn}
                  onClick={() => copyToClipboard(result.outreach.message)}
                >
                  Copy
                </button>
              </div>
              <p style={styles.outreachSubject}>Subject: {result.outreach.subject}</p>
              <p style={styles.outreachBody}>{result.outreach.message}</p>
            </div>

            <p style={styles.poweredBy}>
              Powered by Microsoft Azure AI Foundry + Foundry IQ · Built for Agents League Hackathon 2026
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8f8f6",
    fontFamily: "'Inter', -apple-system, sans-serif",
    color: "#111",
  },
  header: {
    background: "#fff",
    borderBottom: "1px solid #e5e7eb",
    padding: "0 24px",
  },
  headerInner: {
    maxWidth: 900,
    margin: "0 auto",
    height: 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    fontWeight: 700,
    fontSize: 18,
    letterSpacing: "-0.5px",
  },
  badge: {
    fontSize: 11,
    color: "#6366f1",
    background: "#eef2ff",
    padding: "3px 10px",
    borderRadius: 20,
    fontWeight: 500,
  },
  main: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "48px 24px",
  },
  hero: {
    marginBottom: 40,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 800,
    letterSpacing: "-1px",
    margin: "0 0 12px",
  },
  heroSub: {
    fontSize: 17,
    color: "#555",
    maxWidth: 560,
    lineHeight: 1.6,
    margin: 0,
  },
  inputGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
    marginBottom: 24,
  },
  inputBlock: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "#333",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  textarea: {
    height: 280,
    padding: 16,
    border: "1px solid #d1d5db",
    borderRadius: 10,
    fontSize: 14,
    lineHeight: 1.6,
    resize: "vertical",
    fontFamily: "inherit",
    background: "#fff",
    color: "#111",
    outline: "none",
  },
  btn: {
    background: "#111",
    color: "#fff",
    border: "none",
    padding: "14px 32px",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    display: "block",
  },
  error: {
    color: "#dc2626",
    fontSize: 14,
    marginBottom: 16,
  },
  steps: {
    marginTop: 32,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  step: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    flexShrink: 0,
    transition: "background 0.3s",
  },
  stepLabel: {
    fontSize: 14,
    transition: "color 0.3s",
  },
  results: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  resultsHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 700,
    margin: 0,
  },
  resetBtn: {
    background: "none",
    border: "1px solid #d1d5db",
    padding: "8px 16px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 14,
  },
  scoreCard: {
    background: "#111",
    color: "#fff",
    padding: 32,
    borderRadius: 12,
    textAlign: "center",
  },
  scoreNum: {
    fontSize: 64,
    fontWeight: 800,
    lineHeight: 1,
  },
  scoreLabel: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 4,
    marginBottom: 16,
  },
  scoreSummary: {
    fontSize: 15,
    color: "#d1d5db",
    lineHeight: 1.6,
    maxWidth: 500,
    margin: "0 auto",
  },
  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 24,
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 700,
    margin: "0 0 16px",
  },
  skillRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "8px 0",
    borderBottom: "1px solid #f3f4f6",
    gap: 16,
  },
  skillName: {
    fontWeight: 600,
    fontSize: 14,
    flexShrink: 0,
  },
  skillEvidence: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "right",
  },
  skillGap: {
    fontSize: 13,
    color: "#dc2626",
    textAlign: "right",
  },
  tagRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    background: "#fef2f2",
    color: "#dc2626",
    padding: "4px 12px",
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 500,
  },
  bullet: {
    fontSize: 14,
    lineHeight: 1.7,
    margin: "6px 0",
    color: "#333",
  },
  copyBtn: {
    background: "none",
    border: "1px solid #d1d5db",
    padding: "4px 12px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 500,
  },
  outreachSubject: {
    fontSize: 13,
    fontWeight: 600,
    color: "#6366f1",
    marginBottom: 12,
  },
  outreachBody: {
    fontSize: 14,
    lineHeight: 1.7,
    color: "#333",
    whiteSpace: "pre-wrap",
  },
  poweredBy: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 8,
  },
};
