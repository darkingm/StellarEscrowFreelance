import { getStatusBadgeClass } from "@/lib/stellar";

const DEMO_JOBS = [
    {
        id: 1,
        title: "E-Commerce Website Redesign",
        description: "Redesign toàn bộ giao diện e-commerce platform với React + Next.js",
        client: "GDKR4...WXTPN",
        totalAmount: "4,000,000",
        milestones: 3,
        status: "InProgress" as const,
        deadline: "2026-04-15",
        createdAt: "2026-03-20",
    },
    {
        id: 2,
        title: "Mobile App UI/UX Design",
        description: "Thiết kế giao diện ứng dụng mobile cho nền tảng DeFi",
        client: "GDKR4...WXTPN",
        totalAmount: "2,500,000",
        milestones: 2,
        status: "Open" as const,
        deadline: "2026-04-20",
        createdAt: "2026-03-22",
    },
    {
        id: 3,
        title: "Smart Contract Audit",
        description: "Kiểm tra bảo mật và audit Soroban smart contract cho DeFi protocol",
        client: "GABCD...EFGH1",
        totalAmount: "10,000,000",
        milestones: 4,
        status: "Completed" as const,
        deadline: "2026-03-30",
        createdAt: "2026-03-10",
    },
    {
        id: 4,
        title: "Landing Page Design & Development",
        description: "Tạo landing page cho startup blockchain với animated sections",
        client: "GXYZ1...MNOP2",
        totalAmount: "1,500,000",
        milestones: 2,
        status: "Open" as const,
        deadline: "2026-04-25",
        createdAt: "2026-03-23",
    },
    {
        id: 5,
        title: "API Integration & Backend",
        description: "Xây dựng REST API backend với NestJS kết nối Soroban",
        client: "GABCD...EFGH1",
        totalAmount: "6,000,000",
        milestones: 3,
        status: "Disputed" as const,
        deadline: "2026-04-10",
        createdAt: "2026-03-15",
    },
];

export default function JobsPage() {
    return (
        <div className="dashboard">
            <div className="container">
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "32px",
                    }}
                >
                    <div>
                        <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>
                            Browse Jobs
                        </h1>
                        <p style={{ color: "var(--text-secondary)" }}>
                            Tìm công việc phù hợp hoặc tạo job mới
                        </p>
                    </div>
                    <a href="/create" className="btn btn-primary">
                        + Create Job
                    </a>
                </div>

                {/* Filters */}
                <div
                    className="card"
                    style={{
                        display: "flex",
                        gap: "12px",
                        padding: "16px",
                        marginBottom: "24px",
                        alignItems: "center",
                    }}
                >
                    <input
                        className="form-input"
                        type="text"
                        placeholder="🔍 Search jobs..."
                        style={{ flex: 1, marginBottom: 0 }}
                    />
                    <select className="form-input" style={{ width: "160px", marginBottom: 0 }}>
                        <option>All Status</option>
                        <option>Open</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                        <option>Disputed</option>
                    </select>
                    <select className="form-input" style={{ width: "160px", marginBottom: 0 }}>
                        <option>Sort: Newest</option>
                        <option>Highest Budget</option>
                        <option>Deadline</option>
                    </select>
                </div>

                {/* Jobs Grid */}
                <div className="features-grid">
                    {DEMO_JOBS.map((job) => (
                        <a href={`/jobs/${job.id}`} key={job.id}>
                            <div className="card feature-card" style={{ cursor: "pointer", height: "100%" }}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "start",
                                        marginBottom: "12px",
                                    }}
                                >
                                    <span className={`badge ${getStatusBadgeClass(job.status)}`}>
                                        {job.status}
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: "var(--font-mono)",
                                            fontWeight: 700,
                                            color: "var(--accent-emerald)",
                                        }}
                                    >
                                        {job.totalAmount}
                                    </span>
                                </div>
                                <h3 style={{ fontSize: "16px", marginBottom: "8px" }}>{job.title}</h3>
                                <p
                                    style={{
                                        fontSize: "13px",
                                        color: "var(--text-secondary)",
                                        marginBottom: "16px",
                                        lineHeight: "1.5",
                                    }}
                                >
                                    {job.description}
                                </p>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        fontSize: "12px",
                                        color: "var(--text-muted)",
                                        borderTop: "1px solid var(--border)",
                                        paddingTop: "12px",
                                    }}
                                >
                                    <span>{job.milestones} milestones</span>
                                    <span>⏰ {job.deadline}</span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
