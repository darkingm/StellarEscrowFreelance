import { getStatusBadgeClass } from "@/lib/stellar";

// Demo data for the dashboard UI
const DEMO_JOBS = [
    {
        id: 1,
        title: "E-Commerce Website Redesign",
        client: "GDKR4...WXTPN",
        freelancer: "GBYZ3...QMKL2",
        totalAmount: "4,000,000",
        milestones: 3,
        completed: 2,
        status: "InProgress" as const,
        deadline: "2026-04-15",
    },
    {
        id: 2,
        title: "Mobile App UI/UX Design",
        client: "GDKR4...WXTPN",
        freelancer: "—",
        totalAmount: "2,500,000",
        milestones: 2,
        completed: 0,
        status: "Open" as const,
        deadline: "2026-04-20",
    },
    {
        id: 3,
        title: "Smart Contract Audit",
        client: "GABCD...EFGH1",
        freelancer: "GBYZ3...QMKL2",
        totalAmount: "10,000,000",
        milestones: 4,
        completed: 4,
        status: "Completed" as const,
        deadline: "2026-03-30",
    },
];

export default function DashboardPage() {
    return (
        <div className="dashboard">
            <div className="container">
                <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>
                    Dashboard
                </h1>
                <p style={{ color: "var(--text-secondary)", marginBottom: "32px" }}>
                    Quản lý jobs, milestones và thanh toán của bạn
                </p>

                {/* Stats */}
                <div className="dashboard-grid">
                    <div className="card dashboard-stat">
                        <div className="label">Active Jobs</div>
                        <div className="value" style={{ color: "var(--accent-indigo)" }}>
                            3
                        </div>
                    </div>
                    <div className="card dashboard-stat">
                        <div className="label">Total Escrowed</div>
                        <div className="value" style={{ color: "var(--accent-emerald)" }}>
                            16.5M
                        </div>
                    </div>
                    <div className="card dashboard-stat">
                        <div className="label">Completed</div>
                        <div className="value" style={{ color: "var(--accent-cyan)" }}>
                            1
                        </div>
                    </div>
                    <div className="card dashboard-stat">
                        <div className="label">Disputes</div>
                        <div className="value" style={{ color: "var(--accent-rose)" }}>
                            0
                        </div>
                    </div>
                </div>

                {/* Jobs List */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "16px",
                    }}
                >
                    <h2 style={{ fontSize: "20px", fontWeight: 600 }}>Your Jobs</h2>
                    <a href="/create" className="btn btn-primary btn-sm">
                        + New Job
                    </a>
                </div>

                <div className="jobs-list">
                    {DEMO_JOBS.map((job) => (
                        <a href={`/jobs/${job.id}`} key={job.id}>
                            <div className="card job-card">
                                <div>
                                    <div className="job-title">{job.title}</div>
                                    <div className="job-meta">
                                        <span>
                                            {job.completed}/{job.milestones} milestones
                                        </span>
                                        <span>Deadline: {job.deadline}</span>
                                        <span>Freelancer: {job.freelancer}</span>
                                    </div>
                                </div>
                                <span className={`badge ${getStatusBadgeClass(job.status)}`}>
                                    {job.status}
                                </span>
                                <div className="job-amount">{job.totalAmount} XLM</div>
                            </div>
                        </a>
                    ))}
                </div>

                {/* Recent Activity */}
                <h2
                    style={{
                        fontSize: "20px",
                        fontWeight: 600,
                        marginTop: "48px",
                        marginBottom: "16px",
                    }}
                >
                    Recent Activity
                </h2>
                <div className="card" style={{ padding: "20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {[
                            {
                                icon: "✅",
                                text: "Milestone #2 approved — 2,000,000 XLM released",
                                time: "2 min ago",
                            },
                            {
                                icon: "📤",
                                text: "Freelancer submitted Milestone #3 for review",
                                time: "1 hour ago",
                            },
                            {
                                icon: "🤝",
                                text: "Job #1 accepted by GBYZ3...QMKL2",
                                time: "3 hours ago",
                            },
                            {
                                icon: "🆕",
                                text: "Job #2 created — 2,500,000 XLM escrowed",
                                time: "1 day ago",
                            },
                        ].map((activity, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    paddingBottom: i < 3 ? "16px" : "0",
                                    borderBottom: i < 3 ? "1px solid var(--border)" : "none",
                                }}
                            >
                                <span style={{ fontSize: "20px" }}>{activity.icon}</span>
                                <span style={{ flex: 1, fontSize: "14px" }}>
                                    {activity.text}
                                </span>
                                <span
                                    style={{ fontSize: "12px", color: "var(--text-muted)" }}
                                >
                                    {activity.time}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
