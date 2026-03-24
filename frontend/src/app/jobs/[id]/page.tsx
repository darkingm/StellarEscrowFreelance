import { getStatusBadgeClass } from "@/lib/stellar";

// Demo job detail data
const JOB = {
    id: 1,
    title: "E-Commerce Website Redesign",
    description:
        "Redesign toàn bộ giao diện e-commerce platform với React + Next.js. Bao gồm homepage, product listing, cart, checkout flow, và admin dashboard. Phải responsive trên mobile/tablet/desktop.",
    client: "GDKR42NASDXHNG6LOMUERDKJTAOPMLXMF742XBLWXTPN",
    freelancer: "GBYZ3QNOTQGGXIHXNG6LOMUERDKJTAOPMLXMF742QMKL2",
    token: "CDLZFC...NATIVE",
    totalAmount: "4,000,000",
    milestoneCount: 3,
    completedMilestones: 2,
    status: "InProgress" as const,
    createdAt: "2026-03-20",
    deadline: "2026-04-15",
};

const MILESTONES = [
    {
        id: 0,
        description: "Design Mockups — Homepage, Product Page, Cart UI",
        amount: "1,000,000",
        status: "Approved" as const,
        submittedAt: "2026-03-22",
        approvedAt: "2026-03-23",
    },
    {
        id: 1,
        description: "Frontend Development — Next.js implementation",
        amount: "2,000,000",
        status: "Approved" as const,
        submittedAt: "2026-03-25",
        approvedAt: "2026-03-26",
    },
    {
        id: 2,
        description: "Testing & Deployment — QA, performance, deploy",
        amount: "1,000,000",
        status: "Submitted" as const,
        submittedAt: "2026-03-28",
        approvedAt: "",
    },
];

const TX_HISTORY = [
    { type: "create", desc: "Job created", time: "2026-03-20 10:30", hash: "3cb4fc...dac64d" },
    { type: "accept", desc: "Job accepted by freelancer", time: "2026-03-21 14:15", hash: "a1b2c3...def456" },
    { type: "submit", desc: "Milestone #0 submitted", time: "2026-03-22 09:45", hash: "f7e8d9...c0b1a2" },
    { type: "approve", desc: "Milestone #0 approved — 975,000 released", time: "2026-03-23 11:20", hash: "123abc...789def" },
    { type: "submit", desc: "Milestone #1 submitted", time: "2026-03-25 16:00", hash: "456def...012ghi" },
    { type: "approve", desc: "Milestone #1 approved — 1,950,000 released", time: "2026-03-26 10:30", hash: "789ghi...345jkl" },
    { type: "submit", desc: "Milestone #2 submitted", time: "2026-03-28 14:00", hash: "abc123...def456" },
];

function getMilestoneDotClass(status: string) {
    if (status === "Approved") return "completed";
    if (status === "Submitted") return "submitted";
    if (status === "Disputed") return "disputed";
    return "";
}

export default function JobDetailPage() {
    return (
        <div className="dashboard">
            <div className="container">
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "32px" }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                            <a href="/jobs" style={{ color: "var(--text-muted)", fontSize: "14px" }}>← Back to Jobs</a>
                            <span className={`badge ${getStatusBadgeClass(JOB.status)}`}>{JOB.status}</span>
                        </div>
                        <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>{JOB.title}</h1>
                        <p style={{ color: "var(--text-secondary)", maxWidth: "600px", lineHeight: "1.6" }}>{JOB.description}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "32px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--accent-emerald)" }}>
                            {JOB.totalAmount}
                        </div>
                        <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>stroops escrowed</div>
                    </div>
                </div>

                {/* Info Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
                    <div className="card" style={{ padding: "16px" }}>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>CLIENT</div>
                        <div className="wallet-address" style={{ fontSize: "12px" }}>{JOB.client.slice(0, 8)}...{JOB.client.slice(-6)}</div>
                    </div>
                    <div className="card" style={{ padding: "16px" }}>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>FREELANCER</div>
                        <div className="wallet-address" style={{ fontSize: "12px" }}>{JOB.freelancer.slice(0, 8)}...{JOB.freelancer.slice(-6)}</div>
                    </div>
                    <div className="card" style={{ padding: "16px" }}>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>PROGRESS</div>
                        <div style={{ fontSize: "18px", fontWeight: 700 }}>{JOB.completedMilestones}/{JOB.milestoneCount} milestones</div>
                    </div>
                    <div className="card" style={{ padding: "16px" }}>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>DEADLINE</div>
                        <div style={{ fontSize: "18px", fontWeight: 700 }}>{JOB.deadline}</div>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
                    {/* Milestone Timeline */}
                    <div>
                        <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "20px" }}>📋 Milestone Timeline</h2>
                        <div className="milestone-timeline">
                            {MILESTONES.map((ms, i) => (
                                <div className="milestone-item" key={ms.id}>
                                    <div>
                                        <div className={`milestone-dot ${getMilestoneDotClass(ms.status)}`} />
                                        {i < MILESTONES.length - 1 && <div className="milestone-line" />}
                                    </div>
                                    <div className="milestone-content">
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                                            <div>
                                                <h4>Milestone #{ms.id}</h4>
                                                <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "8px" }}>{ms.description}</p>
                                            </div>
                                            <span className={`badge ${getStatusBadgeClass(ms.status)}`}>{ms.status}</span>
                                        </div>
                                        <div style={{ display: "flex", gap: "16px", fontSize: "13px", alignItems: "center" }}>
                                            <span className="amount">{ms.amount} stroops</span>
                                            {ms.submittedAt && <span style={{ color: "var(--text-muted)" }}>Submitted: {ms.submittedAt}</span>}
                                            {ms.approvedAt && <span style={{ color: "var(--text-muted)" }}>Approved: {ms.approvedAt}</span>}
                                        </div>
                                        {ms.status === "Submitted" && (
                                            <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                                                <button className="btn btn-success btn-sm">✅ Approve</button>
                                                <button className="btn btn-danger btn-sm">❌ Reject</button>
                                                <button className="btn btn-secondary btn-sm">⚠️ Dispute</button>
                                            </div>
                                        )}
                                        {ms.status === "Approved" && (
                                            <div style={{ marginTop: "8px", fontSize: "12px", color: "var(--accent-emerald)" }}>
                                                ✅ Funds released to freelancer (minus 2.5% fee)
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div>
                        {/* Escrow Status */}
                        <div className="card" style={{ padding: "20px", marginBottom: "16px", background: "var(--gradient-card)" }}>
                            <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "16px", color: "var(--text-secondary)" }}>ESCROW STATUS</h3>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                <span style={{ color: "var(--text-secondary)", fontSize: "13px" }}>Total Deposited</span>
                                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>4,000,000</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                <span style={{ color: "var(--text-secondary)", fontSize: "13px" }}>Released</span>
                                <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent-emerald)" }}>2,925,000</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                <span style={{ color: "var(--text-secondary)", fontSize: "13px" }}>Fees Collected</span>
                                <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent-amber)" }}>75,000</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: "8px" }}>
                                <span style={{ fontWeight: 600, fontSize: "13px" }}>Remaining</span>
                                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--accent-indigo)" }}>1,000,000</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="card" style={{ padding: "20px", marginBottom: "16px" }}>
                            <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "16px", color: "var(--text-secondary)" }}>ACTIONS</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                <button className="btn btn-primary" style={{ width: "100%" }}>📤 Submit Milestone</button>
                                <button className="btn btn-secondary" style={{ width: "100%" }}>⚠️ Raise Dispute</button>
                                <button className="btn btn-danger" style={{ width: "100%", opacity: 0.5 }} disabled>❌ Cancel Job</button>
                            </div>
                        </div>

                        {/* Transaction History */}
                        <div className="card" style={{ padding: "20px" }}>
                            <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "16px", color: "var(--text-secondary)" }}>TX HISTORY</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {TX_HISTORY.slice().reverse().map((tx, i) => (
                                    <div key={i} style={{ fontSize: "12px", display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: i < TX_HISTORY.length - 1 ? "1px solid var(--border)" : "none" }}>
                                        <div>
                                            <div style={{ fontWeight: 500, marginBottom: "2px" }}>{tx.desc}</div>
                                            <div style={{ color: "var(--text-muted)" }}>{tx.time}</div>
                                        </div>
                                        <a href="#" className="wallet-address" style={{ fontSize: "11px", padding: "2px 6px", alignSelf: "start" }}>{tx.hash}</a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
