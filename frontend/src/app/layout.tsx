import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Freelance Escrow | Decentralized Payments on Stellar",
  description:
    "Trustless milestone-based escrow payments for freelancers. No middleman fees, instant cross-border settlements on Stellar blockchain.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <a href="/" className="logo">
          <div className="logo-icon">🔐</div>
          <span>FreelanceEscrow</span>
        </a>
        <nav className="nav">
          <a href="/">Home</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/jobs">Jobs</a>
          <a href="/create">Create Job</a>
          <a href="/disputes">Disputes</a>
          <a href="/profile">Profile</a>
          <a href="/admin">Admin</a>
        </nav>
        <div className="header-actions">
          <button className="btn btn-primary btn-sm wallet-btn" id="connect-wallet">
            🔗 Connect Wallet
          </button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>
          Built on{" "}
          <a
            href="https://stellar.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Stellar
          </a>{" "}
          | Rise In x Stellar University Tour — 2026
        </p>
        <p style={{ marginTop: "8px" }}>
          Contract:{" "}
          <a
            href="https://stellar.expert/explorer/testnet/contract/CA7VKPOTYB2QQKMZ3W5L4L236PWGXQDJUE5LFEU225LA5RH2RWHNFREB"
            target="_blank"
            rel="noopener noreferrer"
            className="wallet-address"
          >
            CA7VKP...NFREB
          </a>
        </p>
      </div>
    </footer>
  );
}
