import { useMemo, useState } from "react";

const initialValues = {
  name: "",
  email: "",
  id: "",
  password: "",
};

export default function FormPage() {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [submittedData, setSubmittedData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const errors = useMemo(() => validate(values), [values]);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  function handleSubmit(e) {
    e.preventDefault(); // prevent page reload

    // mark all touched so errors show if any
    setTouched({ name: true, email: true, id: true, password: true });

    const currentErrors = validate(values);
    const hasErrors = Object.keys(currentErrors).length > 0;
    if (hasErrors) return;

    // capture data
    setSubmittedData(values);

    // clear form
    setValues(initialValues);
    setTouched({});
    setShowPassword(false);
  }

  const canSubmit = Object.keys(errors).length === 0;

  return (
    <div style={styles.wrapper}>
      <h2>Task 2: Form + Password Toggle</h2>
      <p style={styles.subtext}>
        Controlled inputs, inline validation, show/hide password, and display submitted data.
      </p>

      <div style={styles.card}>
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Name */}
          <div style={styles.field}>
            <label style={styles.label}>Name</label>
            <input
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your name"
              style={{
                ...styles.input,
                ...(touched.name && errors.name ? styles.inputError : {}),
              }}
            />
            {touched.name && errors.name && <p style={styles.errorText}>{errors.name}</p>}
          </div>

          {/* Email */}
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email"
              style={{
                ...styles.input,
                ...(touched.email && errors.email ? styles.inputError : {}),
              }}
            />
            {touched.email && errors.email && <p style={styles.errorText}>{errors.email}</p>}
          </div>

          {/* ID */}
          <div style={styles.field}>
            <label style={styles.label}>ID</label>
            <input
              name="id"
              value={values.id}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your ID"
              style={{
                ...styles.input,
                ...(touched.id && errors.id ? styles.inputError : {}),
              }}
            />
            {touched.id && errors.id && <p style={styles.errorText}>{errors.id}</p>}
          </div>

          {/* Password */}
          <div style={styles.field}>
            <label style={styles.label}>Password</label>

            <div style={styles.passwordRow}>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter password"
                style={{
                  ...styles.input,
                  ...(touched.password && errors.password ? styles.inputError : {}),
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                style={styles.toggleBtn}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {touched.password && errors.password && (
              <p style={styles.errorText}>{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            style={{
              ...styles.submitBtn,
              ...(canSubmit ? {} : styles.submitBtnDisabled),
            }}
          >
            Submit
          </button>
        </form>
      </div>

      {/* Submitted Data */}
      <div style={{ marginTop: 16 }}>
        <h3 style={{ margin: "0 0 10px" }}>Submitted Data</h3>

        {!submittedData ? (
          <p style={{ opacity: 0.75, margin: 0 }}>No submission yet.</p>
        ) : (
          <div style={styles.resultCard}>
            <div style={styles.resultRow}>
              <span style={styles.resultLabel}>Name:</span>
              <span>{submittedData.name}</span>
            </div>
            <div style={styles.resultRow}>
              <span style={styles.resultLabel}>Email:</span>
              <span>{submittedData.email}</span>
            </div>
            <div style={styles.resultRow}>
              <span style={styles.resultLabel}>ID:</span>
              <span>{submittedData.id}</span>
            </div>
            <div style={styles.resultRow}>
              <span style={styles.resultLabel}>Password:</span>
              <span>{submittedData.password}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function validate(values) {
  const errs = {};

  if (!values.name.trim()) errs.name = "Name is required.";

  if (!values.email.trim()) {
    errs.email = "Email is required.";
  } else if (!isValidEmail(values.email.trim())) {
    errs.email = "Please enter a valid email.";
  }

  if (!values.id.trim()) errs.id = "ID is required.";

  if (!values.password.trim()) errs.password = "Password is required.";

  return errs;
}

function isValidEmail(email) {
  // simple + reliable enough for assignment
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const styles = {
  wrapper: { display: "grid", gap: 10 },
  subtext: { opacity: 0.8, marginTop: 6, marginBottom: 10 },

  card: {
    padding: 16,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
  },

  form: { display: "grid", gap: 14 },

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
  inputError: { borderColor: "rgba(239, 68, 68, 0.6)" },

  errorText: { margin: 0, fontSize: 12, color: "rgba(239, 68, 68, 0.95)" },

  passwordRow: { display: "grid", gridTemplateColumns: "1fr auto", gap: 10 },

  toggleBtn: {
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.04)",
    color: "inherit",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  submitBtn: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(99, 102, 241, 0.55)",
    background: "rgba(99, 102, 241, 0.25)",
    color: "inherit",
    cursor: "pointer",
    fontWeight: 600,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },

  resultCard: {
    padding: 14,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    display: "grid",
    gap: 8,
  },
  resultRow: { display: "flex", gap: 8, alignItems: "baseline", flexWrap: "wrap" },
  resultLabel: { opacity: 0.8, fontSize: 13, minWidth: 80 },
};
