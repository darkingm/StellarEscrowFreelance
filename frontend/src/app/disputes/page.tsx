import { getStatusBadgeClass } from "@/lib/stellar";

const DISPUTES = [
    {
        id: 1,
        jobId: 5,
        jobTitle: "API Integration & Backend",
        milestoneId: 2,
        milestoneDescription: "API endpoints không hoạt động đúng theo spec",
        raisedBy: "GDKR4...WXTPN",
        raisedByRole: "Client",
        reason: "Freelancer submit milestone nhưng API endpoints trả về sai format, thiếu 3 endpoints theo spec ban đầu.",
        status: "Disputed" as const,
        createdAt: "2026-03-22",
        resolution: null,
    },
    {
        id: 2,
        jobId: 3,
        jobTitle: "Smart Contract Audit",
        milestoneId: 1,
        milestoneDescription: "Security audit report",
        raisedBy: "GBYZ3...QMKL2",
        raisedByRole: "Freelancer",
        reason: "Client không phản hồi milestone đã submit hơn 7 ngày. Yêu cầu auto-approve hoặc admin can thiệp.",
        status: "Completed" as const,
        createdAt: "2026-03-15",
        resolution: "PayFreelancer",
    },
];

export default function DisputesPage() {
    return (
        <div className="dashboard">
            <div className="container">
                <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>
                    ⚖️ Dispute Management
                </h1>
                <p style={{ color: "var(--text-secondary)", marginBottom: "32px" }}>
                    Quản lý tranh chấp giữa client và freelancer. Admin giải quyết on-chain.
                </p>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
                    <div className="card" style={{ padding: "20px", textAlign: "center" }}>
                        <div style={{ fontSize: "32px", fontWeight: 700, color: "var(--accent-rose)" }}>1</div>
                        <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Active Disputes</div>
                    </div>
                    <div className="card" style={{ padding: "20px", textAlign: "center" }}>
                        <div style={{ fontSize: "32px", fontWeight: 700, color: "var(--accent-emerald)" }}>1</div>
                        <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Resolved</div>
                    </div>
                    <div className="card" style={{ padding: "20px", textAlign: "center" }}>
                        <div style={{ fontSize: "32px", fontWeight: 700, color: "var(--accent-indigo)" }}>2</div>
                        <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Total</div>
                    </div>
                </div>

                {/* Disputes List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {DISPUTES.map((dispute) => (
                        <div className="card" key={dispute.id} style={{ padding: "24px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" }}>
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                                        <span className={`badge ${getStatusBadgeClass(dispute.status)}`}>{dispute.status}</span>
                                        <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Dispute #{dispute.id}</span>
                                        <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>•</span>
                                        <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Job #{dispute.jobId}</span>
                                    </div>
                                    <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "4px" }}>{dispute.jobTitle}</h3>
                                    <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                                        Milestone #{dispute.milestoneId}: {dispute.milestoneDescription}
                                    </p>
                                </div>
                                <div style={{ textAlign: "right", fontSize: "13px", color: "var(--text-muted)" }}>
                                    <div>Raised by: <span style={{ color: "var(--accent-cyan)" }}>{dispute.raisedByRole}</span></div>
                                    <div>{dispute.createdAt}</div>
                                </div>
                            </div>

                            {/* Reason */}
                            <div style={{ background: "var(--bg-secondary)", padding: "16px", borderRadius: "var(--radius-md)", marginBottom: "16px", borderLeft: "3px solid var(--accent-rose)" }}>
                                <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "8px" }}>REASON</div>
                                <p style={{ fontSize: "14px", lineHeight: "1.6" }}>{dispute.reason}</p>
                            </div>

                            {/* Resolution */}
                            {dispute.resolution && (
                                <div style={{ background: "rgba(16, 185, 129, 0.08)", padding: "16px", borderRadius: "var(--radius-md)", marginBottom: "16px", borderLeft: "3px solid var(--accent-emerald)" }}>
                                    <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--accent-emerald)", marginBottom: "4px" }}>RESOLVED</div>
                                    <p style={{ fontSize: "14px" }}>Resolution: <strong>{dispute.resolution}</strong> — Funds paid to freelancer</p>
                                </div>
                            )}

                            {/* Actions for active disputes */}
                            {dispute.status === "Disputed" && (
                                <div style={{ display: "flex", gap: "8px", paddingTop: "8px", borderTop: "1px solid var(--border)" }}>
                                    <button className="btn btn-success btn-sm">💰 Pay Freelancer</button>
                                    <button className="btn btn-secondary btn-sm">🔄 Refund Client</button>
                                    <button className="btn btn-secondary btn-sm">⚖️ Split 50/50</button>
                                    <div style={{ flex: 1 }} />
                                    <a href={`/jobs/${dispute.jobId}`} className="btn btn-secondary btn-sm">View Job →</a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
