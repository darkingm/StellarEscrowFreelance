export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-content animate-in">
          <h1>Work Without Borders. Pay Without Banks.</h1>
          <p>
            Nền tảng escrow phi tập trung cho freelancer — thanh toán theo
            milestone, phí gần 0, không middleman, cross-border tức thì trên
            Stellar blockchain.
          </p>
          <div className="hero-actions">
            <a href="/create" className="btn btn-primary btn-lg">
              🚀 Create a Job
            </a>
            <a href="/jobs" className="btn btn-secondary btn-lg">
              Browse Jobs
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container">
        <div className="stats-bar">
          <div className="card stat-card">
            <div className="stat-value">~$0.000003</div>
            <div className="stat-label">Transaction Fee</div>
          </div>
          <div className="card stat-card">
            <div className="stat-value">~5s</div>
            <div className="stat-label">Settlement Time</div>
          </div>
          <div className="card stat-card">
            <div className="stat-value">2.5%</div>
            <div className="stat-label">Platform Fee</div>
          </div>
          <div className="card stat-card">
            <div className="stat-value">100%</div>
            <div className="stat-label">On-Chain Transparent</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section container">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">
          4 bước đơn giản để thanh toán freelance an toàn, minh bạch
        </p>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h4>Create Job</h4>
            <p>Client tạo job với milestones và deposit tiền vào escrow</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h4>Accept & Work</h4>
            <p>Freelancer accept job và bắt đầu làm việc</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h4>Submit & Review</h4>
            <p>Freelancer submit milestone, client review kết quả</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h4>Approve & Pay</h4>
            <p>Client approve → tiền tự động chuyển cho freelancer</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section container">
        <h2 className="section-title">Why FreelanceEscrow?</h2>
        <p className="section-subtitle">
          So sánh với Fiverr/Upwork — tại sao blockchain tốt hơn
        </p>
        <div className="features-grid">
          <div className="card feature-card">
            <div className="feature-icon">💰</div>
            <h3>Phí Cực Thấp</h3>
            <p>
              Chỉ 2.5% platform fee + $0.000003 tx fee. So với 20% trên
              Fiverr/Upwork — tiết kiệm tới 90%.
            </p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Thanh Toán Tức Thì</h3>
            <p>
              Nhận tiền trong ~5 giây sau khi approve. Không đợi 14 ngày như
              các nền tảng truyền thống.
            </p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Cross-Border</h3>
            <p>
              Freelancer ở bất kỳ quốc gia nào đều nhận được tiền. Không cần
              tài khoản ngân hàng quốc tế.
            </p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Escrow An Toàn</h3>
            <p>
              Tiền được giữ trên smart contract — không ai rút trộm được. Chỉ
              release khi client approve.
            </p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon">⚖️</div>
            <h3>Dispute Resolution</h3>
            <p>
              Tranh chấp? Admin giải quyết on-chain — refund, pay, hoặc
              50/50 split. Minh bạch, công bằng.
            </p>
          </div>
          <div className="card feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Không Bị Ban</h3>
            <p>
              Phi tập trung = không ai kiểm soát. Account bạn không thể bị
              ban hoặc đóng băng.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section container" style={{ textAlign: "center", paddingBottom: "120px" }}>
        <h2 className="section-title">Ready to Start?</h2>
        <p className="section-subtitle">
          Kết nối ví Freighter và bắt đầu tạo job hoặc tìm việc ngay
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary btn-lg">🔗 Connect Freighter Wallet</button>
        </div>
      </section>
    </>
  );
}
