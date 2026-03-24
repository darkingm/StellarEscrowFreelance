export default function ProfilePage() {
    return (
        <div className="dashboard">
            <div className="container" style={{ maxWidth: "900px" }}>
                {/* Profile Header */}
                <div className="card" style={{ padding: "32px", marginBottom: "24px", background: "var(--gradient-card)" }}>
                    <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
                        <div style={{
                            width: "80px", height: "80px", borderRadius: "50%",
                            background: "var(--gradient-button)", display: "flex",
                            alignItems: "center", justifyContent: "center", fontSize: "32px"
                        }}>
                            👤
                        </div>
                        <div style={{ flex: 1 }}>
                            <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "4px" }}>Trần Nguyên Kiên</h1>
                            <div className="wallet-address" style={{ display: "inline-block", marginBottom: "8px" }}>
                                GBO33X...K67NWTC
                            </div>
                            <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
                                Full-stack developer & Soroban smart contract engineer
                            </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: "36px", fontWeight: 700, color: "var(--accent-emerald)" }}>4.8</div>
                            <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>⭐ Rating</div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
                    <div className="card" style={{ padding: "20px", textAlign: "center" }}>
                        <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--accent-indigo)" }}>12</div>
                        <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Jobs Completed</div>
                    </div>
                    <div className="card" style={{ padding: "20px", textAlign: "center" }}>
                        <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--accent-emerald)" }}>48M</div>
                        <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Total Earned</div>
                    </div>
                    <div className="card" style={{ padding: "20px", textAlign: "center" }}>
                        <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--accent-cyan)" }}>2</div>
                        <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Active Jobs</div>
                    </div>
                    <div className="card" style={{ padding: "20px", textAlign: "center" }}>
                        <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--accent-rose)" }}>0</div>
                        <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Disputes Lost</div>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                    {/* Job History */}
                    <div>
                        <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "16px" }}>📋 Job History</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {[
                                { title: "E-Commerce Redesign", amount: "4,000,000", status: "InProgress", date: "Mar 2026" },
                                { title: "Smart Contract Audit", amount: "10,000,000", status: "Completed", date: "Mar 2026" },
                                { title: "DeFi Dashboard", amount: "6,500,000", status: "Completed", date: "Feb 2026" },
                                { title: "NFT Marketplace Frontend", amount: "8,000,000", status: "Completed", date: "Jan 2026" },
                                { title: "Landing Page Design", amount: "1,200,000", status: "Completed", date: "Dec 2025" },
                            ].map((job, i) => (
                                <div className="card" key={i} style={{ padding: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div>
                                        <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "2px" }}>{job.title}</div>
                                        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{job.date}</div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--accent-emerald)", fontWeight: 600 }}>{job.amount}</div>
                                        <span className={`badge ${job.status === "Completed" ? "badge-completed" : "badge-progress"}`} style={{ fontSize: "11px" }}>{job.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reviews */}
                    <div>
                        <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "16px" }}>⭐ Reviews</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {[
                                { from: "GABCD...EFGH1", rating: 5, comment: "Excellent work! Delivered ahead of schedule with great quality.", date: "Mar 2026" },
                                { from: "GXYZ1...MNOP2", rating: 5, comment: "Very professional. Code quality is top-notch and well-documented.", date: "Feb 2026" },
                                { from: "GHIJK...LMNO3", rating: 4, comment: "Good communication throughout the project. Minor delays but solid output.", date: "Jan 2026" },
                            ].map((review, i) => (
                                <div className="card" key={i} style={{ padding: "16px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                        <span className="wallet-address" style={{ fontSize: "12px" }}>{review.from}</span>
                                        <span style={{ color: "var(--accent-amber)" }}>{"⭐".repeat(review.rating)}</span>
                                    </div>
                                    <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.5" }}>{review.comment}</p>
                                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "8px" }}>{review.date}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
