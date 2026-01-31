import { useMemo, useState } from "react";

export default function ProgressPage() {
  // You can increase/decrease number of inputs here
  const [values, setValues] = useState([20, 40, 60]);

  const average = useMemo(() => {
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, v) => acc + v, 0);
    return Math.round(sum / values.length);
  }, [values]);

  const mainColor = useMemo(() => getColorByPercent(average), [average]);

  function handleChange(index, rawValue) {
    // allow empty typing but treat it as 0 for bar
    const cleaned = rawValue === "" ? "" : toClampedInt(rawValue);

    setValues((prev) => {
      const next = [...prev];
      next[index] = cleaned;
      return next;
    });
  }

  function handleBlur(index) {
    // If user leaves it empty, set to 0 on blur
    setValues((prev) => {
      const next = [...prev];
      if (next[index] === "") next[index] = 0;
      return next;
    });
  }

  function addInput() {
    setValues((prev) => [...prev, 0]);
  }

  function removeInput(index) {
    setValues((prev) => prev.filter((_, i) => i !== index));
  }

  // Convert possible "" into number for rendering bar width
  const safeValues = useMemo(() => values.map((v) => (v === "" ? 0 : v)), [values]);

  return (
    <div style={styles.wrapper}>
      <h2>Task 3: Progress Bar</h2>
      <p style={styles.subtext}>
        Multiple inputs (0–100). Main bar uses the <b>average</b>. Sub bars show
        each input.
      </p>

      {/* Inputs */}
      <div style={styles.card}>
        <div style={styles.inputsHeader}>
          <h3 style={{ margin: 0, fontSize: 16 }}>Inputs</h3>
          <button onClick={addInput} style={styles.secondaryBtn} type="button">
            + Add Input
          </button>
        </div>

        <div style={styles.inputsGrid}>
          {values.map((val, idx) => (
            <div key={idx} style={styles.inputRow}>
              <label style={styles.label}>Input {idx + 1}</label>
              <div style={styles.inputWithBtn}>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={val}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onBlur={() => handleBlur(idx)}
                  style={styles.input}
                />
                <button
                  type="button"
                  onClick={() => removeInput(idx)}
                  style={styles.dangerBtn}
                  disabled={values.length === 1}
                  title={values.length === 1 ? "At least one input required" : "Remove input"}
                >
                  Remove
                </button>
              </div>
              <p style={styles.help}>
                Auto clamped: &lt;0 → 0, &gt;100 → 100
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Progress */}
      <div style={styles.card}>
        <div style={styles.progressHeader}>
          <h3 style={{ margin: 0, fontSize: 16 }}>Overall Progress</h3>
          <span style={styles.percentText}>{average}%</span>
        </div>

        <div style={styles.barOuter}>
          <div
            style={{
              ...styles.barFill,
              width: `${average}%`,
              background: mainColor,
            }}
          />
        </div>

        {/* Sub bars */}
        <div style={{ marginTop: 14 }}>
          <h4 style={styles.subTitle}>Sub bars</h4>
          <div style={styles.subBars}>
            {safeValues.map((v, idx) => {
              const c = getColorByPercent(v);
              return (
                <div key={idx} style={styles.subBarRow}>
                  <div style={styles.subBarLabel}>Input {idx + 1}</div>
                  <div style={styles.subBarOuter}>
                    <div
                      style={{
                        ...styles.subBarFill,
                        width: `${v}%`,
                        background: c,
                      }}
                    />
                  </div>
                  <div style={styles.subBarValue}>{v}%</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={styles.note}>
        Color rule: red &lt; 40%, orange 40–70%, green &gt; 70%
      </div>
    </div>
  );
}

function toClampedInt(value) {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return 0;
  if (n < 0) return 0;
  if (n > 100) return 100;
  return n;
}

function getColorByPercent(p) {
  if (p < 40) return "rgba(239, 68, 68, 0.85)"; // red
  if (p > 70) return "rgba(34, 197, 94, 0.85)"; // green
  return "rgba(245, 158, 11, 0.85)"; // orange/yellow
}

const styles = {
  wrapper: { display: "grid", gap: 10 },
  subtext: { opacity: 0.8, marginTop: 6, marginBottom: 10 },

  card: {
    padding: 16,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    display: "grid",
    gap: 12,
  },

  inputsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },

  inputsGrid: {
    display: "grid",
    gap: 14,
  },

  inputRow: { display: "grid", gap: 6 },

  label: { fontSize: 13, opacity: 0.9 },

  inputWithBtn: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 10,
    alignItems: "center",
  },

  input: {
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.04)",
    color: "inherit",
    outline: "none",
    width: "100%",
  },

  help: { margin: 0, opacity: 0.7, fontSize: 12 },

  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 10,
  },
  percentText: { fontSize: 14, opacity: 0.9 },

  barOuter: {
    height: 18,
    borderRadius: 999,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
  },
  barFill: {
    height: "100%",
    width: "0%",
    borderRadius: 999,
    transition: "width 350ms ease",
  },

  subTitle: { margin: "0 0 8px", fontSize: 14, opacity: 0.9 },
  subBars: { display: "grid", gap: 10 },

  subBarRow: {
    display: "grid",
    gridTemplateColumns: "90px 1fr 48px",
    gap: 10,
    alignItems: "center",
  },
  subBarLabel: { fontSize: 12, opacity: 0.8 },
  subBarValue: { fontSize: 12, opacity: 0.85, textAlign: "right" },

  subBarOuter: {
    height: 12,
    borderRadius: 999,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
  },
  subBarFill: {
    height: "100%",
    width: "0%",
    borderRadius: 999,
    transition: "width 350ms ease",
  },

  secondaryBtn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "inherit",
    cursor: "pointer",
  },
  dangerBtn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.04)",
    color: "inherit",
    cursor: "pointer",
  },

  note: { opacity: 0.8, fontSize: 12, paddingTop: 6 },
};
