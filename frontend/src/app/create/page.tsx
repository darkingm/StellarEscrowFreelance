export default function CreateJobPage() {
    return (
        <div className="dashboard">
            <div className="container" style={{ maxWidth: "720px" }}>
                <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>
                    Create New Job
                </h1>
                <p style={{ color: "var(--text-secondary)", marginBottom: "32px" }}>
                    Tạo job mới và deposit tiền vào escrow. Freelancer sẽ thấy job của
                    bạn và có thể accept.
                </p>

                <div className="card" style={{ padding: "32px" }}>
                    {/* Job Details */}
                    <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "20px", color: "var(--accent-indigo)" }}>
                        📋 Job Details
                    </h3>

                    <div className="form-group">
                        <label className="form-label">Job Title</label>
                        <input
                            className="form-input"
                            type="text"
                            placeholder="e.g. E-Commerce Website Redesign"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-input"
                            placeholder="Mô tả chi tiết công việc cần làm..."
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div className="form-group">
                            <label className="form-label">Payment Token</label>
                            <select className="form-input">
                                <option>XLM (Native)</option>
                                <option>USDC</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Deadline</label>
                            <input className="form-input" type="date" />
                        </div>
                    </div>

                    {/* Milestones */}
                    <h3
                        style={{
                            fontSize: "16px",
                            fontWeight: 600,
                            marginTop: "32px",
                            marginBottom: "20px",
                            color: "var(--accent-cyan)",
                        }}
                    >
                        🎯 Milestones
                    </h3>

                    {[
                        { name: "Design Mockups", amount: "1,000,000" },
                        { name: "Frontend Development", amount: "2,000,000" },
                        { name: "Testing & Deployment", amount: "1,000,000" },
                    ].map((ms, i) => (
                        <div
                            key={i}
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr auto auto",
                                gap: "12px",
                                alignItems: "end",
                                marginBottom: "12px",
                            }}
                        >
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Milestone {i + 1}</label>
                                <input
                                    className="form-input"
                                    type="text"
                                    defaultValue={ms.name}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Amount (stroops)</label>
                                <input
                                    className="form-input"
                                    type="text"
                                    defaultValue={ms.amount}
                                    style={{ fontFamily: "var(--font-mono)" }}
                                />
                            </div>
                            <button
                                className="btn btn-danger btn-sm"
                                style={{ marginBottom: "0", height: "42px" }}
                            >
                                ✕
                            </button>
                        </div>
                    ))}

                    <button
                        className="btn btn-secondary btn-sm"
                        style={{ marginTop: "8px" }}
                    >
                        + Add Milestone
                    </button>

                    {/* Summary */}
                    <div
                        className="card"
                        style={{
                            marginTop: "32px",
                            background: "var(--gradient-card)",
                            padding: "20px",
                        }}
                    >
                        <h3
                            style={{
                                fontSize: "14px",
                                fontWeight: 600,
                                marginBottom: "12px",
                                color: "var(--text-secondary)",
                            }}
                        >
                            DEPOSIT SUMMARY
                        </h3>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                            <span style={{ color: "var(--text-secondary)" }}>
                                Total Milestones
                            </span>
                            <span style={{ fontWeight: 600 }}>3</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                            <span style={{ color: "var(--text-secondary)" }}>
                                Total Amount
                            </span>
                            <span
                                style={{
                                    fontWeight: 700,
                                    fontFamily: "var(--font-mono)",
                                    color: "var(--accent-emerald)",
                                }}
                            >
                                4,000,000 stroops
                            </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "var(--text-secondary)" }}>
                                Platform Fee (2.5%)
                            </span>
                            <span
                                style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
                            >
                                ~100,000 stroops (on approval)
                            </span>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        className="btn btn-primary btn-lg"
                        style={{ width: "100%", marginTop: "24px" }}
                    >
                        🔐 Deposit & Create Job
                    </button>
                    <p
                        style={{
                            textAlign: "center",
                            marginTop: "12px",
                            fontSize: "13px",
                            color: "var(--text-muted)",
                        }}
                    >
                        Requires Freighter wallet signature. Funds will be held in escrow.
                    </p>
                </div>
            </div>
        </div>
    );
}
