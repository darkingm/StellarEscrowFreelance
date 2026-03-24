# 🔐 Freelance Escrow — Decentralized Milestone-Based Payments

> **Nền tảng Escrow Freelance phi tập trung trên Stellar/Soroban** — Giải phóng thanh toán theo milestone, không phí trung gian cao, không bị ban account, cross-border.

## Vấn Đề

Freelancer quốc tế phải chịu phí trung gian cao (20% trên Fiverr/Upwork), rủi ro bị ban account, và thanh toán cross-border chậm trễ — gây mất niềm tin giữa client và freelancer.

## Giải Pháp

Smart contract escrow trên Stellar tự động giữ tiền trong escrow, giải phóng theo từng milestone khi client approve, và có cơ chế dispute resolution minh bạch on-chain — loại bỏ hoàn toàn middleman.

## Tại Sao Stellar

- **Phí giao dịch ~$0.000003** — gần như miễn phí so với 20% phí Fiverr
- **Xử lý ~5 giây** — thanh toán tức thì, không đợi 14 ngày
- **Cross-border native** — freelancer ở bất kỳ quốc gia nào đều nhận được tiền
- **Soroban smart contract** — logic escrow chạy on-chain, không ai có thể thay đổi

## Người Dùng Mục Tiêu

Freelancer và client quốc tế muốn thanh toán nhanh, rẻ, minh bạch — đặc biệt ở các quốc gia đang phát triển nơi phí chuyển tiền cao.

## Demo Trực Tiếp

- **Mạng**: Stellar Testnet
- **Contract ID**: `CA7VKPOTYB2QQKMZ3W5L4L236PWGXQDJUE5LFEU225LA5RH2RWHNFREB`
- **Stellar Expert**: [Xem Contract](https://stellar.expert/explorer/testnet/contract/CA7VKPOTYB2QQKMZ3W5L4L236PWGXQDJUE5LFEU225LA5RH2RWHNFREB)
- **Stellar Lab**: [Xem trên Lab](https://lab.stellar.org/r/testnet/contract/CA7VKPOTYB2QQKMZ3W5L4L236PWGXQDJUE5LFEU225LA5RH2RWHNFREB)

## Tính Năng Chính

| Tính Năng | Mô Tả |
|---|---|
| **Tạo Job** | Client tạo job với nhiều milestones, deposit tiền vào escrow |
| **Accept Job** | Freelancer chấp nhận job, trạng thái chuyển sang InProgress |
| **Submit Milestone** | Freelancer nộp milestone đã hoàn thành |
| **Approve & Release** | Client approve milestone → tiền tự động chuyển cho freelancer |
| **Dispute** | Client hoặc freelancer có thể raise dispute |
| **Resolve Dispute** | Admin giải quyết: hoàn tiền client / trả freelancer / chia 50/50 |
| **Cancel Job** | Client hủy job chưa ai accept → hoàn tiền 100% |
| **Platform Fee** | 2.5% phí nền tảng, trừ khi approve milestone |

## Kiến Trúc Smart Contract

```
┌─────────────────────────────────────────────────────────┐
│                   FreelanceEscrow Contract               │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Client ──► create_job() ──► Deposit tokens to escrow   │
│                    │                                     │
│  Freelancer ──► accept_job() ──► Status: InProgress     │
│                    │                                     │
│  Freelancer ──► submit_milestone() ──► Status: Submitted│
│                    │                                     │
│  Client ──► approve_milestone() ──► Release funds 💰    │
│                    │           (minus 2.5% platform fee) │
│                    │                                     │
│  Either ──► raise_dispute() ──► Status: Disputed        │
│                    │                                     │
│  Admin ──► resolve_dispute() ──► Refund/Pay/Split       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Cách Chạy

### Yêu Cầu
- Rust (rustc 1.84.0+)
- Stellar CLI (stellar 25.x+)
- wasm32-unknown-unknown target

### Build & Test

```bash
# Clone repo
git clone https://github.com/AshLien/freelance-escrow-stellar.git
cd freelance-escrow-stellar

# Build contract
stellar contract build

# Chạy 10 unit tests
cargo test -p freelance-escrow
```

### Deploy lên Testnet

```bash
# Tạo tài khoản test
stellar keys generate student --network testnet --fund

# Deploy contract
stellar contract deploy \
  --wasm target/wasm32v1-none/release/freelance_escrow.wasm \
  --source-account student \
  --network testnet

# Initialize contract (2.5% phí)
stellar contract invoke \
  --id YOUR_CONTRACT_ID \
  --source-account student \
  --network testnet \
  -- initialize \
  --admin $(stellar keys address student) \
  --platform_fee_bps 250
```

## Cấu Trúc Dự Án

```
soroban-hello-world/
├── contracts/
│   └── freelance-escrow/
│       ├── Cargo.toml           # Dependencies (soroban-sdk v25)
│       └── src/
│           └── lib.rs           # Smart contract + 10 tests
├── Cargo.toml                   # Workspace config
└── README.md                    # File này
```

## Smart Contract Functions

| Function | Caller | Mô Tả |
|---|---|---|
| `initialize(admin, platform_fee_bps)` | Admin | Khởi tạo contract, thiết lập phí |
| `create_job(client, token, milestones, deadline)` | Client | Tạo job + deposit tiền vào escrow |
| `accept_job(freelancer, job_id)` | Freelancer | Chấp nhận job |
| `submit_milestone(freelancer, job_id, milestone_id)` | Freelancer | Nộp milestone |
| `approve_milestone(client, job_id, milestone_id)` | Client | Approve + release tiền |
| `raise_dispute(caller, job_id, milestone_id)` | Client/Freelancer | Mở dispute |
| `resolve_dispute(job_id, milestone_id, resolution)` | Admin | Giải quyết dispute |
| `cancel_job(client, job_id)` | Client | Hủy job (chỉ khi Open) |
| `get_job(job_id)` | Anyone | Xem thông tin job |
| `get_milestone(job_id, milestone_id)` | Anyone | Xem thông tin milestone |
| `get_platform_fee()` | Anyone | Xem phí hiện tại |

## Bảo Mật

- ✅ Mọi mutating function đều dùng `require_auth()` — chỉ người có quyền mới thay đổi được
- ✅ Token transfers qua Stellar Asset Contract (SAC) — an toàn, chuẩn Stellar
- ✅ Phí chỉ trừ khi approve milestone — không trừ khi deposit
- ✅ Tiền ở trong contract cho đến khi được release — không ai rút trộm được
- ✅ Chỉ admin giải quyết dispute
- ✅ Job chỉ cancel được trước khi freelancer accept
- ✅ 10 unit tests bao phủ happy path, edge cases, auth, và dispute flows

## Tests (10/10 Passed ✅)

```
test test::test_full_happy_path ... ok
test test::test_cancel_open_job ... ok
test test::test_cannot_cancel_in_progress_job ... ok
test test::test_dispute_resolve_refund_client ... ok
test test::test_dispute_resolve_pay_freelancer ... ok
test test::test_dispute_resolve_split ... ok
test test::test_platform_fee_calculation ... ok
test test::test_wrong_freelancer_cannot_submit ... ok
test test::test_double_submit_milestone ... ok
test test::test_multiple_milestones_sequential ... ok

test result: ok. 10 passed; 0 failed
```

## Tech Stack

- **Smart Contract**: Rust / Soroban SDK v25
- **Blockchain**: Stellar Testnet
- **Token Standard**: Stellar Asset Contract (SAC)
- **CLI**: Stellar CLI v25.2.0
- **Wallet**: Freighter Browser Extension

## Nhóm

| Thành Viên | Email | Trường |
|---|---|---|
| Trần Nguyên Kiên | kien4941@gmail.com | University of Greenwich |
| Nguyễn Như Thiện | | University of Greenwich |
| Lương Văn An | | University of Greenwich |
| Trần Lê Khoa | | University of Greenwich |

---

*Rise In x Stellar University Tour — Tháng 3 năm 2026*
