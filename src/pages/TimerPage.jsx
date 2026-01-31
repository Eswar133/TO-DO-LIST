import { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "react_intern_assignment_timer_v1";

// status: "idle" | "running" | "paused" | "completed"
export default function TimerPage() {
  const [inputSeconds, setInputSeconds] = useState(10); // config input
  const [status, setStatus] = useState("idle");
  const [remainingMs, setRemainingMs] = useState(10_000);

  // Important rule: Start button must be hidden permanently after timer completes once
  const [startHiddenForever, setStartHiddenForever] = useState(false);

  const rafRef = useRef(null);
  const lastTickRef = useRef(null);

  // Used for persistence during running
  const runningStartEpochRef = useRef(null);
  const runningStartRemainingRef = useRef(null);

  // ---- Load persisted state on mount ----
  useEffect(() => {
    const saved = loadTimer();
    if (!saved) return;

    setInputSeconds(saved.configSeconds);
    setStartHiddenForever(Boolean(saved.startHiddenForever));

    // Apply saved state
    if (saved.status === "running") {
      // compute correct remaining based on now - startEpoch
      const elapsed = Date.now() - saved.runningStartEpoch;
      const computedRemaining = Math.max(0, saved.runningStartRemainingMs - elapsed);

      setRemainingMs(computedRemaining);

      if (computedRemaining === 0) {
        // completed
        stopAnimationLoop();
        setStatus("completed");
        setStartHiddenForever(true);
        persistTimer({
          status: "completed",
          configSeconds: saved.configSeconds,
          remainingMs: 0,
          startHiddenForever: true,
        });
      } else {
        // resume running automatically
        setStatus("running");

        runningStartEpochRef.current = Date.now();
        runningStartRemainingRef.current = computedRemaining;
        persistTimer({
          status: "running",
          configSeconds: saved.configSeconds,
          remainingMs: computedRemaining, // snapshot
          runningStartEpoch: runningStartEpochRef.current,
          runningStartRemainingMs: runningStartRemainingRef.current,
          startHiddenForever: Boolean(saved.startHiddenForever),
        });

        startAnimationLoop();
      }
    } else {
      setStatus(saved.status);
      setRemainingMs(saved.remainingMs);
      persistTimer({
        status: saved.status,
        configSeconds: saved.configSeconds,
        remainingMs: saved.remainingMs,
        startHiddenForever: Boolean(saved.startHiddenForever),
      });
    }

    // cleanup on unmount
    return () => stopAnimationLoop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Derived UI values ----
  const formatted = useMemo(() => formatMs(remainingMs), [remainingMs]);
  const statusText = useMemo(() => {
    if (status === "running") return "Running";
    if (status === "paused") return "Paused";
    if (status === "completed") return "Completed";
    return "Idle";
  }, [status]);

  // ---- Validations ----
  const isRunning = status === "running";
  const isPaused = status === "paused";
  const isCompleted = status === "completed";

  const canStart = status === "idle" && !startHiddenForever && remainingMs > 0;
  const canPause = isRunning;
  const canResume = isPaused && remainingMs > 0;
  const canReset = status !== "idle"; // reset from running/paused/completed

  // ---- Handlers ----
  function handleChangeSeconds(e) {
    const raw = e.target.value;

    // allow typing empty temporarily
    if (raw === "") {
      setInputSeconds("");
      return;
    }

    // accept only positive integers
    const n = Number.parseInt(raw, 10);
    if (Number.isNaN(n)) return;
    if (n < 1) {
      setInputSeconds(1);
      if (status === "idle") setRemainingMs(1000);
      return;
    }

    setInputSeconds(n);

    if (status === "idle") {
      setRemainingMs(n * 1000);
      persistTimer({
        status: "idle",
        configSeconds: n,
        remainingMs: n * 1000,
        startHiddenForever,
      });
    }
  }

  function handleBlurSeconds() {
    // if user leaves empty, set to 10
    if (inputSeconds === "") {
      setInputSeconds(10);
      if (status === "idle") {
        setRemainingMs(10_000);
        persistTimer({
          status: "idle",
          configSeconds: 10,
          remainingMs: 10_000,
          startHiddenForever,
        });
      }
    }
  }

  function start() {
    if (!canStart) return;

    const configSec = inputSeconds === "" ? 10 : inputSeconds;
    const startMs = configSec * 1000;

    setRemainingMs(startMs);
    setStatus("running");

    runningStartEpochRef.current = Date.now();
    runningStartRemainingRef.current = startMs;

    persistTimer({
      status: "running",
      configSeconds: configSec,
      remainingMs: startMs,
      runningStartEpoch: runningStartEpochRef.current,
      runningStartRemainingMs: runningStartRemainingRef.current,
      startHiddenForever,
    });

    startAnimationLoop();
  }

  function pause() {
    if (!canPause) return;

    stopAnimationLoop();
    setStatus("paused");

    // Persist paused snapshot
    const configSec = inputSeconds === "" ? 10 : inputSeconds;
    persistTimer({
      status: "paused",
      configSeconds: configSec,
      remainingMs,
      startHiddenForever,
    });
  }

  function resume() {
    if (!canResume) return;

    setStatus("running");

    runningStartEpochRef.current = Date.now();
    runningStartRemainingRef.current = remainingMs;

    const configSec = inputSeconds === "" ? 10 : inputSeconds;
    persistTimer({
      status: "running",
      configSeconds: configSec,
      remainingMs,
      runningStartEpoch: runningStartEpochRef.current,
      runningStartRemainingMs: runningStartRemainingRef.current,
      startHiddenForever,
    });

    startAnimationLoop();
  }

  function reset() {
    stopAnimationLoop();

    const configSec = inputSeconds === "" ? 10 : inputSeconds;
    const ms = configSec * 1000;

    setStatus("idle");
    setRemainingMs(ms);

    // Start button stays hidden forever if it was completed once
    persistTimer({
      status: "idle",
      configSeconds: configSec,
      remainingMs: ms,
      startHiddenForever,
    });
  }

  // ---- Animation loop with requestAnimationFrame ----
  function startAnimationLoop() {
    stopAnimationLoop();
    lastTickRef.current = performance.now();

    const tick = (now) => {
      const last = lastTickRef.current ?? now;
      const delta = now - last;
      lastTickRef.current = now;

      setRemainingMs((prev) => {
        const next = Math.max(0, prev - delta);

        if (next === 0) {
          // completed
          stopAnimationLoop();
          setStatus("completed");
          setStartHiddenForever(true);

          const configSec = inputSeconds === "" ? 10 : inputSeconds;
          persistTimer({
            status: "completed",
            configSeconds: configSec,
            remainingMs: 0,
            startHiddenForever: true,
          });

          return 0;
        }

        // keep persistence accurate during running:
        // update running start point occasionally (every frame is okay for assignment)
        runningStartEpochRef.current = Date.now();
        runningStartRemainingRef.current = next;

        const configSec = inputSeconds === "" ? 10 : inputSeconds;
        persistTimer({
          status: "running",
          configSeconds: configSec,
          remainingMs: next,
          runningStartEpoch: runningStartEpochRef.current,
          runningStartRemainingMs: runningStartRemainingRef.current,
          startHiddenForever,
        });

        return next;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }

  function stopAnimationLoop() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    lastTickRef.current = null;
  }

  // ---- UI ----
  return (
    <div style={styles.wrapper}>
      <h2>Task 4: Advanced Countdown Timer</h2>
      <p style={styles.subtext}>
        Persistent timer state (refresh safe), ms precision, dynamic button rules.
      </p>

      <div style={styles.card}>
        <div style={styles.topRow}>
          <div style={styles.field}>
            <label style={styles.label}>Starting Time (seconds)</label>
            <input
              type="number"
              min={1}
              step={1}
              value={inputSeconds}
              onChange={handleChangeSeconds}
              onBlur={handleBlurSeconds}
              disabled={isRunning}
              style={styles.input}
            />
            <p style={styles.help}>
              Only positive integers. Disabled while running.
            </p>
          </div>

          <div style={styles.statusBox}>
            <div style={styles.statusLabel}>Status</div>
            <div style={styles.statusValue}>{statusText}</div>
          </div>
        </div>

        <div style={styles.timerBox}>
          <div style={styles.timerValue}>{formatted}</div>
          {isCompleted && <div style={styles.timesUp}>Time’s up!</div>}
        </div>

        <div style={styles.buttons}>
          {/* Start must hide permanently after completion */}
          {!startHiddenForever && (
            <button
              type="button"
              onClick={start}
              style={{ ...styles.btnPrimary, ...(canStart ? {} : styles.btnDisabled) }}
              disabled={!canStart}
            >
              Start
            </button>
          )}

          <button
            type="button"
            onClick={pause}
            style={{ ...styles.btn, ...(canPause ? {} : styles.btnDisabled) }}
            disabled={!canPause}
          >
            Pause
          </button>

          <button
            type="button"
            onClick={resume}
            style={{ ...styles.btn, ...(canResume ? {} : styles.btnDisabled) }}
            disabled={!canResume}
          >
            Resume
          </button>

          <button
            type="button"
            onClick={reset}
            style={{ ...styles.btnSecondary, ...(canReset ? {} : styles.btnDisabled) }}
            disabled={!canReset}
          >
            Reset
          </button>
        </div>

        <div style={styles.ruleNote}>
          Rules: No multiple timers (single RAF loop), Start hides permanently after completion.
        </div>
      </div>
    </div>
  );
}

function formatMs(ms) {
  const totalMs = Math.max(0, Math.floor(ms));
  const seconds = Math.floor(totalMs / 1000);
  const millis = totalMs % 1000;

  const mm = String(millis).padStart(3, "0");
  return `${seconds}.${mm}s`;
}

function loadTimer() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;

    const configSeconds = clampPositiveInt(parsed.configSeconds ?? 10);
    const status = ["idle", "running", "paused", "completed"].includes(parsed.status)
      ? parsed.status
      : "idle";

    const remainingMs = typeof parsed.remainingMs === "number" ? Math.max(0, parsed.remainingMs) : configSeconds * 1000;

    const startHiddenForever = Boolean(parsed.startHiddenForever);

    return {
      status,
      configSeconds,
      remainingMs,
      runningStartEpoch: typeof parsed.runningStartEpoch === "number" ? parsed.runningStartEpoch : null,
      runningStartRemainingMs:
        typeof parsed.runningStartRemainingMs === "number" ? parsed.runningStartRemainingMs : null,
      startHiddenForever,
    };
  } catch {
    return null;
  }
}

function persistTimer(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

function clampPositiveInt(n) {
  const x = Number.parseInt(n, 10);
  if (Number.isNaN(x) || x < 1) return 1;
  return x;
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
    gap: 14,
  },

  topRow: {
    display: "grid",
    gridTemplateColumns: "1fr 220px",
    gap: 14,
    alignItems: "start",
  },

  field: { display: "grid", gap: 6 },
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
  help: { margin: 0, opacity: 0.7, fontSize: 12 },

  statusBox: {
    padding: 12,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
  },
  statusLabel: { fontSize: 12, opacity: 0.75 },
  statusValue: { marginTop: 6, fontSize: 16, fontWeight: 700 },

  timerBox: {
    padding: 14,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    display: "grid",
    gap: 8,
    justifyItems: "center",
  },
  timerValue: { fontSize: 32, fontWeight: 800, letterSpacing: 0.3 },
  timesUp: { fontSize: 14, color: "rgba(34, 197, 94, 0.95)", fontWeight: 700 },

  buttons: { display: "flex", gap: 10, flexWrap: "wrap" },

  btn: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.04)",
    color: "inherit",
    cursor: "pointer",
    fontWeight: 600,
  },
  btnPrimary: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(99, 102, 241, 0.55)",
    background: "rgba(99, 102, 241, 0.25)",
    color: "inherit",
    cursor: "pointer",
    fontWeight: 700,
  },
  btnSecondary: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(34, 197, 94, 0.40)",
    background: "rgba(34, 197, 94, 0.12)",
    color: "inherit",
    cursor: "pointer",
    fontWeight: 700,
  },
  btnDisabled: { opacity: 0.55, cursor: "not-allowed" },

  ruleNote: { opacity: 0.8, fontSize: 12, paddingTop: 4 },
};
