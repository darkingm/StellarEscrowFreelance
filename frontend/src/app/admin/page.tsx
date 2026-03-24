export default function AdminPage() {
    return (
        <div className="dashboard">
            <div className="container">
                <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>
                    🛡️ Admin Panel
                </h1>
                <p style={{ color: "var(--text-secondary)", marginBottom: "32px" }}>
                    Quản lý platform — disputes, fees, stats
                </p>

                {/* Platform Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px", marginBottom: "32px" }}>
                    <div className="card" style={{ padding: "20px", textAlign: "center" }}>
                        <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--accent-indigo)" }}>5</div>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Total Jobs</div>
                    </div>
                    <div className="card" style={{ padding: "20px", textAlign: "center" }}>
                        <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--accent-emerald)" }}>24M</div>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Total Escrowed</div>
                    </div>
                    <div className="card" style={{ padding: "20px", textAlign: "center" }}>
                        <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--accent-amber)" }}>175K</div>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Fees Collected</div>
                    </div>
                    <div className="card" style={{ padding: "20px", textAlign: "center" }}>
                        <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--accent-rose)" }}>1</div>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Active Disputes</div>
                    </div>
                    <div className="card" style={{ padding: "20px", textAlign: "center" }}>
                        <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--accent-cyan)" }}>2.5%</div>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Platform Fee</div>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                    {/* Contract Info */}
                    <div className="card" style={{ padding: "24px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "20px", color: "var(--accent-indigo)" }}>📋 Contract Info</h3>
                        {[
                            { label: "Contract ID", value: "CA7VKP...NFREB", mono: true },
                            { label: "Network", value: "Stellar Testnet", mono: false },
                            { label: "Admin", value: "GBO33X...K67NWTC", mono: true },
                            { label: "Platform Fee", value: "250 bps (2.5%)", mono: false },
                            { label: "Total Jobs Created", value: "5", mono: false },
                        ].map((item, i) => (
                            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
                                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{item.label}</span>
                                <span style={{ fontSize: "13px", fontWeight: 600, fontFamily: item.mono ? "var(--font-mono)" : "inherit" }}>
                                    {item.mono ? <span className="wallet-address" style={{ padding: "2px 8px" }}>{item.value}</span> : item.value}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Admin Actions */}
                    <div className="card" style={{ padding: "24px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "20px", color: "var(--accent-cyan)" }}>⚡ Admin Actions</h3>

                        <div className="form-group">
                            <label className="form-label">Update Platform Fee (bps)</label>
                            <div style={{ display: "flex", gap: "8px" }}>
                                <input className="form-input" type="number" defaultValue={250} style={{ flex: 1 }} />
                                <button className="btn btn-primary btn-sm">Update</button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Transfer Admin Role</label>
                            <div style={{ display: "flex", gap: "8px" }}>
                                <input className="form-input" type="text" placeholder="New admin address..." style={{ flex: 1 }} />
                                <button className="btn btn-danger btn-sm">Transfer</button>
                            </div>
                        </div>

                        <div style={{ marginTop: "16px" }}>
                            <a href="/disputes" className="btn btn-secondary" style={{ width: "100%" }}>
                                ⚖️ Manage Disputes ({1} active)
                            </a>
                        </div>
                    </div>
                </div>

                {/* Recent Jobs */}
                <h2 style={{ fontSize: "20px", fontWeight: 600, marginTop: "32px", marginBottom: "16px" }}>📊 All Jobs Overview</h2>
                <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-secondary)" }}>
                                {["ID", "Title", "Client", "Freelancer", "Amount", "Status", "Milestones"].map(h => (
                                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { id: 1, title: "E-Commerce Redesign", client: "GDKR4...WXT", freelancer: "GBYZ3...QMK", amount: "4,000,000", status: "InProgress", ms: "2/3" },
                                { id: 2, title: "Mobile App UI/UX", client: "GDKR4...WXT", freelancer: "—", amount: "2,500,000", status: "Open", ms: "0/2" },
                                { id: 3, title: "SC Audit", client: "GABCD...EFG", freelancer: "GBYZ3...QMK", amount: "10,000,000", status: "Completed", ms: "4/4" },
                                { id: 4, title: "Landing Page", client: "GXYZ1...MNO", freelancer: "—", amount: "1,500,000", status: "Open", ms: "0/2" },
                                { id: 5, title: "API Backend", client: "GABCD...EFG", freelancer: "GBYZ3...QMK", amount: "6,000,000", status: "Disputed", ms: "1/3" },
                            ].map(job => (
                                <tr key={job.id} style={{ borderBottom: "1px solid var(--border)" }}>
                                    <td style={{ padding: "12px 16px", fontWeight: 600 }}>#{job.id}</td>
                                    <td style={{ padding: "12px 16px" }}>{job.title}</td>
                                    <td style={{ padding: "12px 16px" }}><span className="wallet-address" style={{ fontSize: "11px", padding: "2px 6px" }}>{job.client}</span></td>
                                    <td style={{ padding: "12px 16px" }}>{job.freelancer === "—" ? "—" : <span className="wallet-address" style={{ fontSize: "11px", padding: "2px 6px" }}>{job.freelancer}</span>}</td>
                                    <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", color: "var(--accent-emerald)" }}>{job.amount}</td>
                                    <td style={{ padding: "12px 16px" }}><span className={`badge badge-${job.status === "InProgress" ? "progress" : job.status === "Completed" ? "completed" : job.status === "Disputed" ? "disputed" : "open"}`}>{job.status}</span></td>
                                    <td style={{ padding: "12px 16px" }}>{job.ms}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
