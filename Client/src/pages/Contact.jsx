function Contact() {
  return (
    <div
      style={{
        padding: "3rem",
        background: "#020617",
        minHeight: "calc(100vh - 120px)",
        color: "#e5e7eb",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          background: "#0f172a",
          padding: "2rem",
          borderRadius: "1rem",
          border: "1px solid #1f2937",
          width: "100%",
          maxWidth: "520px",
        }}
      >
        <h1
          style={{
            color: "#38bdf8",
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          Contact Us
        </h1>

        {/* ✅ GOOGLE FORM – REAL SUBMISSION */}
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSd-E6Nv9fajmXu8RtOwfZGspKyc4R6mjChefwU4FCmPVuQtCw/viewform?embedded=true"
          width="100%"
          height="700"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          style={{ borderRadius: "0.6rem" }}
          title="Contact Form"
        >
          Loading…
        </iframe>
      </div>
    </div>
  );
}

export default Contact;
