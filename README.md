# 🔐 FreelanceEscrow — Decentralized Freelance Payment Platform

> Trustless milestone-based escrow payments on **Stellar blockchain (Soroban)**. No middleman, near-zero fees, instant cross-border settlements.

**Rise In x Stellar University Tour 2026**

---

## 👥 Team

| Member | Role | Student ID |
|--------|------|------------|
| Trần Nguyên Kiên | Smart Contract & Full-Stack Dev | SE173598 |
| Member 2 | Frontend Dev | — |
| Member 3 | Backend Dev | — |

---

## 📁 Project Structure

```
StellarEscrowFreelance/
├── contracts/                    # Soroban Smart Contracts (Rust)
│   ├── freelance-escrow/         # Main escrow contract
│   │   └── src/lib.rs            # 15 functions, 10 unit tests
│   └── hello-world/              # Example contract
├── frontend/                     # Next.js 16 (TypeScript)
│   └── src/
│       ├── app/                  # 8 pages (App Router)
│       │   ├── page.tsx          # Landing page
│       │   ├── dashboard/        # Dashboard
│       │   ├── jobs/             # Jobs listing + [id] detail
│       │   ├── create/           # Create job wizard
│       │   ├── disputes/         # Dispute management
│       │   ├── profile/          # User profile
│       │   └── admin/            # Admin panel
│       └── lib/stellar.ts        # Stellar SDK integration
├── backend/                      # NestJS v11 (TypeScript)
│   └── src/
│       ├── app.module.ts         # Root module
│       ├── main.ts               # Entry point (port 4000)
│       ├── stellar/              # Stellar blockchain service
│       ├── auth/                 # Wallet-based authentication
│       ├── jobs/                 # Jobs CRUD + search/filter
│       ├── milestones/           # Milestone submit/approve/reject
│       ├── disputes/             # Dispute raise/resolve
│       └── users/                # User profiles
├── Cargo.toml                    # Rust workspace config
├── Cargo.lock
├── .gitignore                    # Excludes: target/, node_modules/, .env, dist/
└── README.md
```

---

## 🔗 Deployed Contract

| Item | Value |
|------|-------|
| **Network** | Stellar Testnet |
| **Contract ID** | `CA7VKPOTYB2QQKMZ3W5L4L236PWGXQDJUE5LFEU225LA5RH2RWHNFREB` |
| **Explorer** | [stellar.expert](https://stellar.expert/explorer/testnet/contract/CA7VKPOTYB2QQKMZ3W5L4L236PWGXQDJUE5LFEU225LA5RH2RWHNFREB) |
| **Platform Fee** | 2.5% (250 bps) |

---

## ⚙️ Smart Contract Functions (15 total)

### Core Lifecycle
| Function | Description |
|----------|-------------|
| `initialize` | Set admin + platform fee |
| `create_job` | Client creates job with milestones, deposits funds |
| `accept_job` | Freelancer accepts job → status = InProgress |
| `submit_milestone` | Freelancer submits completed work |
| `approve_milestone` | Client approves → funds released (minus fee) |
| `reject_milestone` | Client rejects → milestone back to Pending |
| `cancel_job` | Client cancels open job → refund |

### Dispute Resolution
| Function | Description |
|----------|-------------|
| `raise_dispute` | Either party raises dispute on a milestone |
| `resolve_dispute` | Admin resolves: `RefundClient`, `PayFreelancer`, or `Split` |

### Admin
| Function | Description |
|----------|-------------|
| `update_platform_fee` | Admin changes fee (max 10%) |
| `transfer_admin` | Admin transfers role to new address |

### Query
| Function | Description |
|----------|-------------|
| `get_job` | Get job details by ID |
| `get_milestone` | Get milestone details |
| `get_job_count` | Total jobs created |
| `get_admin` | Get admin address |
| `get_all_milestones` | Get all milestones for a job |

---

## 🧪 Test Results

```
running 10 tests
test test::test_initialize ... ok
test test::test_create_job ... ok
test test::test_accept_job ... ok
test test::test_submit_milestone ... ok
test test::test_approve_milestone_with_fee ... ok
test test::test_full_job_lifecycle ... ok
test test::test_cancel_job_refund ... ok
test test::test_raise_dispute ... ok
test test::test_resolve_dispute_split ... ok
test test::test_wrong_freelancer_cannot_submit ... ok

test result: ok. 10 passed; 0 failed; 0 ignored
```

---

## 🚀 Getting Started

### Prerequisites
- [Rust](https://rustup.rs/) + `wasm32v1-none` target
- [Stellar CLI](https://soroban.stellar.org/docs/getting-started/setup)
- [Node.js 18+](https://nodejs.org/)

### Smart Contract
```bash
# Build
stellar contract build

# Test
cargo test -p freelance-escrow

# Deploy to testnet
stellar contract deploy \
  --wasm target/wasm32v1-none/release/freelance_escrow.wasm \
  --source-account <YOUR_KEY> --network testnet
```

### Frontend (port 3000)
```bash
cd frontend
npm install
npm run dev
```

### Backend API (port 4000)
```bash
cd backend
npm install
npm run start:dev
```

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stellar/contract` | Contract info |
| GET | `/api/stellar/stats` | Platform stats |
| POST | `/api/auth/challenge` | Request auth challenge |
| POST | `/api/auth/verify` | Verify wallet signature |
| GET | `/api/jobs` | List jobs (filter: `?status=Open&search=...`) |
| POST | `/api/jobs` | Create job |
| GET | `/api/jobs/:id` | Job detail |
| PATCH | `/api/jobs/:id/accept` | Accept job |
| GET | `/api/milestones/job/:id` | Get milestones for job |
| GET | `/api/disputes` | List disputes |
| POST | `/api/disputes` | Raise dispute |
| GET | `/api/users/:address` | User profile |

---

## 🔒 Security

- `require_auth()` on all state-mutating contract functions
- Wallet-based authentication (no passwords)
- `.gitignore` excludes: `.env`, `*.key`, `*.secret`, `*.pem`, `node_modules/`, `target/`, `dist/`
- Platform fee capped at 10% max on-chain
- Admin role transfer requires current admin signature

---

## 📄 License

MIT License — Rise In x Stellar University Tour 2026
