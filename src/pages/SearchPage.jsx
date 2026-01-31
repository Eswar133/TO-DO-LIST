import { useMemo, useState } from "react";

const NAMES = [
  "Monkey D. Luffy",
  "Roronoa Zoro",
  "Nami",
  "Usopp",
  "Sanji",
  "Tony Tony Chopper",
  "Nico Robin",
  "Franky",
  "Brook",
  "Jinbe",
  "Portgas D. Ace",
  "Sabo",
  "Trafalgar D. Water Law",
  "Boa Hancock",
  "Dracule Mihawk",
  "Shanks",
  "Gol D. Roger",
  "Silvers Rayleigh",
  "Kozuki Oden",
  "Charlotte Katakuri",
  "Donquixote Doflamingo",
  "Eustass Kid",
  "Killer",
  "Marshall D. Teach",
  "Monkey D. Garp",
];

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const trimmedQuery = query.trim();

  const filtered = useMemo(() => {
    if (!trimmedQuery) return NAMES;

    const q = trimmedQuery.toLowerCase();
    return NAMES.filter((name) => name.toLowerCase().includes(q));
  }, [trimmedQuery]);

  const matchCount = filtered.length;

  return (
    <div style={styles.wrapper}>
      <h2>Task 5: Live Search + Highlight</h2>
      <p style={styles.subtext}>
        Case-insensitive search with <b>bold highlighting</b> for matching parts
        (supports multiple occurrences).
      </p>

      <div style={styles.card}>
        <label style={styles.label}>Search</label>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a name (e.g., d, ro, monkey)"
          style={styles.input}
        />

        <div style={styles.metaRow}>
          {trimmedQuery ? (
            <span style={styles.count}>
              Matching results: <b>{matchCount}</b>
            </span>
          ) : (
            <span style={styles.count}>
              Showing all: <b>{NAMES.length}</b>
            </span>
          )}

          {trimmedQuery && (
            <button type="button" onClick={() => setQuery("")} style={styles.clearBtn}>
              Clear
            </button>
          )}
        </div>

        <div style={styles.listBox}>
          {matchCount === 0 ? (
            <div style={styles.noMatch}>No matches found</div>
          ) : (
            <ul style={styles.list}>
              {filtered.map((name) => (
                <li key={name} style={styles.item}>
                  {renderHighlighted(name, trimmedQuery)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div style={styles.note}>
        Highlight rule: all occurrences of the query are bolded (case-insensitive).
      </div>
    </div>
  );
}

function renderHighlighted(text, query) {
  if (!query) return text;

  // Escape regex special characters in query
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(${escaped})`, "gi");

  // Split text by matches, keep matches using capturing group
  const parts = text.split(re);

  return parts.map((part, idx) => {
    const isMatch = part.toLowerCase() === query.toLowerCase();
    return isMatch ? (
      <strong key={idx} style={styles.highlight}>
        {part}
      </strong>
    ) : (
      <span key={idx}>{part}</span>
    );
  });
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
    gap: 10,
  },

  label: { fontSize: 13, opacity: 0.9 },

  input: {
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.04)",
    color: "inherit",
    outline: "none",
    width: "100%",
  },

  metaRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 2,
  },
  count: { fontSize: 13, opacity: 0.85 },

  clearBtn: {
    padding: "8px 10px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "inherit",
    cursor: "pointer",
    fontSize: 13,
  },

  listBox: {
    marginTop: 6,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.02)",
    overflow: "hidden",
  },

  list: {
    margin: 0,
    padding: 0,
    listStyle: "none",
    display: "grid",
  },

  item: {
    padding: "12px 12px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    fontSize: 14,
  },

  noMatch: { padding: 12, opacity: 0.8, fontSize: 13 },

  highlight: { fontWeight: 800 },

  note: { opacity: 0.8, fontSize: 12, paddingTop: 6 },
};
