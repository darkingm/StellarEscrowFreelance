#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, contracterror, token, Address, Env, String, Vec,
    symbol_short,
};

// ─── Constants ───────────────────────────────────────────────────────────────
const DAY: u32 = 17280; // ~1 day in ledgers

// ─── Error Codes ─────────────────────────────────────────────────────────────
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum Error {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    NotAdmin = 3,
    NotClient = 4,
    NotFreelancer = 5,
    NotAuthorized = 6,
    JobNotFound = 7,
    MilestoneNotFound = 8,
    InvalidJobStatus = 9,
    InvalidMilestoneStatus = 10,
    InvalidAmount = 11,
    InvalidFee = 12,
    NoMilestones = 13,
    DeadlinePassed = 14,
    AlreadyAccepted = 15,
    MilestoneAlreadySubmitted = 16,
    MilestoneNotSubmitted = 17,
    JobNotDisputed = 18,
    ZeroAmount = 19,
}

// ─── Enums ───────────────────────────────────────────────────────────────────
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum JobStatus {
    Open = 0,
    InProgress = 1,
    Completed = 2,
    Cancelled = 3,
    Disputed = 4,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum MilestoneStatus {
    Pending = 0,
    Submitted = 1,
    Approved = 2,
    Disputed = 3,
    Rejected = 4,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum DisputeResolution {
    RefundClient = 0,
    PayFreelancer = 1,
    Split = 2,
}

// ─── Data Structures ─────────────────────────────────────────────────────────
#[contracttype]
#[derive(Clone, Debug)]
pub struct MilestoneInput {
    pub description: String,
    pub amount: i128,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct Milestone {
    pub id: u32,
    pub job_id: u64,
    pub description: String,
    pub amount: i128,
    pub status: MilestoneStatus,
    pub submitted_at: u64,
    pub approved_at: u64,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct Job {
    pub id: u64,
    pub client: Address,
    pub freelancer: Address,
    pub token: Address,
    pub total_amount: i128,
    pub milestone_count: u32,
    pub completed_milestones: u32,
    pub status: JobStatus,
    pub created_at: u64,
    pub deadline: u64,
}

// ─── Storage Keys ────────────────────────────────────────────────────────────
#[contracttype]
pub enum DataKey {
    Admin,
    PlatformFeeBps,
    PlatformFeeCollected(Address), // token -> total fees collected
    JobCount,
    Job(u64),
    Milestone(u64, u32), // (job_id, milestone_id)
    Initialized,
}

// ─── Contract ────────────────────────────────────────────────────────────────
#[contract]
pub struct FreelanceEscrow;

#[contractimpl]
impl FreelanceEscrow {
    // ═══════════════════════════════════════════════════════════════════════
    // ADMIN FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════

    /// Initialize the contract. Can only be called once.
    /// `platform_fee_bps`: platform fee in basis points (e.g. 250 = 2.5%, max 1000 = 10%)
    pub fn initialize(env: Env, admin: Address, platform_fee_bps: u32) -> Result<(), Error> {
        if env.storage().instance().has(&DataKey::Initialized) {
            return Err(Error::AlreadyInitialized);
        }
        if platform_fee_bps > 1000 {
            return Err(Error::InvalidFee);
        }
        admin.require_auth();

        env.storage().instance().set(&DataKey::Initialized, &true);
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::PlatformFeeBps, &platform_fee_bps);
        env.storage().instance().set(&DataKey::JobCount, &0_u64);
        env.storage().instance().extend_ttl(30 * DAY, 60 * DAY);
        Ok(())
    }

    // ═══════════════════════════════════════════════════════════════════════
    // JOB LIFECYCLE
    // ═══════════════════════════════════════════════════════════════════════

    /// Client creates a new job with milestones and deposits the total funds into escrow.
    /// Each milestone specifies a description and amount.
    /// The sum of all milestone amounts is transferred from client to contract.
    pub fn create_job(
        env: Env,
        client: Address,
        token: Address,
        milestones: Vec<MilestoneInput>,
        deadline: u64,
    ) -> Result<u64, Error> {
        Self::require_initialized(&env)?;
        client.require_auth();

        if milestones.is_empty() {
            return Err(Error::NoMilestones);
        }

        // Calculate total amount across all milestones
        let mut total_amount: i128 = 0;
        for i in 0..milestones.len() {
            let ms = milestones.get(i).unwrap();
            if ms.amount <= 0 {
                return Err(Error::ZeroAmount);
            }
            total_amount += ms.amount;
        }

        // Generate job ID
        let job_id: u64 = env
            .storage()
            .instance()
            .get(&DataKey::JobCount)
            .unwrap_or(0)
            + 1;

        // Transfer funds from client to this contract (escrow)
        let token_client = token::Client::new(&env, &token);
        token_client.transfer(&client, &env.current_contract_address(), &total_amount);

        // Create a placeholder freelancer address (will be set on accept)
        // We use the client address as placeholder — it will be overwritten
        let job = Job {
            id: job_id,
            client: client.clone(),
            freelancer: client.clone(), // placeholder, overwritten on accept_job
            token: token.clone(),
            total_amount,
            milestone_count: milestones.len(),
            completed_milestones: 0,
            status: JobStatus::Open,
            created_at: env.ledger().timestamp(),
            deadline,
        };

        // Store job
        env.storage().persistent().set(&DataKey::Job(job_id), &job);
        env.storage()
            .persistent()
            .extend_ttl(&DataKey::Job(job_id), 89 * DAY, 90 * DAY);

        // Store each milestone
        for i in 0..milestones.len() {
            let ms_input = milestones.get(i).unwrap();
            let milestone = Milestone {
                id: i as u32,
                job_id,
                description: ms_input.description,
                amount: ms_input.amount,
                status: MilestoneStatus::Pending,
                submitted_at: 0,
                approved_at: 0,
            };
            env.storage()
                .persistent()
                .set(&DataKey::Milestone(job_id, i as u32), &milestone);
            env.storage().persistent().extend_ttl(
                &DataKey::Milestone(job_id, i as u32),
                89 * DAY,
                90 * DAY,
            );
        }

        // Update job count
        env.storage().instance().set(&DataKey::JobCount, &job_id);
        env.storage().instance().extend_ttl(30 * DAY, 60 * DAY);

        env.events()
            .publish((symbol_short!("job_new"), client), job_id);

        Ok(job_id)
    }

    /// Freelancer accepts an open job. Only works if the job status is Open.
    pub fn accept_job(env: Env, freelancer: Address, job_id: u64) -> Result<(), Error> {
        Self::require_initialized(&env)?;
        freelancer.require_auth();

        let mut job: Job = Self::load_job(&env, job_id)?;

        if job.status != JobStatus::Open {
            return Err(Error::AlreadyAccepted);
        }

        // Freelancer cannot be the same as client
        if job.client == freelancer {
            return Err(Error::NotAuthorized);
        }

        job.freelancer = freelancer.clone();
        job.status = JobStatus::InProgress;

        env.storage().persistent().set(&DataKey::Job(job_id), &job);
        env.storage()
            .persistent()
            .extend_ttl(&DataKey::Job(job_id), 89 * DAY, 90 * DAY);

        env.events()
            .publish((symbol_short!("job_acc"), freelancer), job_id);

        Ok(())
    }

    /// Freelancer submits a milestone as completed.
    pub fn submit_milestone(
        env: Env,
        freelancer: Address,
        job_id: u64,
        milestone_id: u32,
    ) -> Result<(), Error> {
        Self::require_initialized(&env)?;
        freelancer.require_auth();

        let job = Self::load_job(&env, job_id)?;
        if job.status != JobStatus::InProgress {
            return Err(Error::InvalidJobStatus);
        }
        if job.freelancer != freelancer {
            return Err(Error::NotFreelancer);
        }

        let mut milestone = Self::load_milestone(&env, job_id, milestone_id)?;
        if milestone.status != MilestoneStatus::Pending {
            return Err(Error::MilestoneAlreadySubmitted);
        }

        milestone.status = MilestoneStatus::Submitted;
        milestone.submitted_at = env.ledger().timestamp();

        env.storage()
            .persistent()
            .set(&DataKey::Milestone(job_id, milestone_id), &milestone);
        env.storage().persistent().extend_ttl(
            &DataKey::Milestone(job_id, milestone_id),
            89 * DAY,
            90 * DAY,
        );

        env.events()
            .publish((symbol_short!("ms_sub"), job_id), milestone_id);

        Ok(())
    }

    /// Client approves a submitted milestone.
    /// Funds (minus platform fee) are released to the freelancer.
    /// If all milestones approved, job status becomes Completed.
    pub fn approve_milestone(
        env: Env,
        client: Address,
        job_id: u64,
        milestone_id: u32,
    ) -> Result<(), Error> {
        Self::require_initialized(&env)?;
        client.require_auth();

        let mut job = Self::load_job(&env, job_id)?;
        if job.client != client {
            return Err(Error::NotClient);
        }
        if job.status != JobStatus::InProgress && job.status != JobStatus::Disputed {
            return Err(Error::InvalidJobStatus);
        }

        let mut milestone = Self::load_milestone(&env, job_id, milestone_id)?;
        if milestone.status != MilestoneStatus::Submitted {
            return Err(Error::MilestoneNotSubmitted);
        }

        // Calculate fee and net payment
        let fee_bps: u32 = env
            .storage()
            .instance()
            .get(&DataKey::PlatformFeeBps)
            .unwrap_or(0);
        let fee_amount = (milestone.amount * fee_bps as i128) / 10_000;
        let net_amount = milestone.amount - fee_amount;

        // Transfer net amount to freelancer
        let token_client = token::Client::new(&env, &job.token);
        token_client.transfer(&env.current_contract_address(), &job.freelancer, &net_amount);

        // Transfer fee to admin if non-zero
        if fee_amount > 0 {
            let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
            token_client.transfer(&env.current_contract_address(), &admin, &fee_amount);

            // Track collected fees
            let collected: i128 = env
                .storage()
                .persistent()
                .get(&DataKey::PlatformFeeCollected(job.token.clone()))
                .unwrap_or(0);
            env.storage().persistent().set(
                &DataKey::PlatformFeeCollected(job.token.clone()),
                &(collected + fee_amount),
            );
        }

        // Update milestone
        milestone.status = MilestoneStatus::Approved;
        milestone.approved_at = env.ledger().timestamp();
        env.storage()
            .persistent()
            .set(&DataKey::Milestone(job_id, milestone_id), &milestone);

        // Update job
        job.completed_milestones += 1;
        if job.completed_milestones == job.milestone_count {
            job.status = JobStatus::Completed;
        } else if job.status == JobStatus::Disputed {
            // If job was disputed but client approves, revert to InProgress
            job.status = JobStatus::InProgress;
        }
        env.storage().persistent().set(&DataKey::Job(job_id), &job);
        env.storage()
            .persistent()
            .extend_ttl(&DataKey::Job(job_id), 89 * DAY, 90 * DAY);

        env.events()
            .publish((symbol_short!("ms_appr"), job_id), milestone_id);

        Ok(())
    }

    // ═══════════════════════════════════════════════════════════════════════
    // DISPUTE RESOLUTION
    // ═══════════════════════════════════════════════════════════════════════

    /// Either client or freelancer can raise a dispute on a submitted milestone.
    pub fn raise_dispute(
        env: Env,
        caller: Address,
        job_id: u64,
        milestone_id: u32,
    ) -> Result<(), Error> {
        Self::require_initialized(&env)?;
        caller.require_auth();

        let mut job = Self::load_job(&env, job_id)?;
        if job.status != JobStatus::InProgress {
            return Err(Error::InvalidJobStatus);
        }

        // Only client or freelancer can dispute
        if caller != job.client && caller != job.freelancer {
            return Err(Error::NotAuthorized);
        }

        let mut milestone = Self::load_milestone(&env, job_id, milestone_id)?;
        // Can dispute a submitted or pending milestone
        if milestone.status == MilestoneStatus::Approved {
            return Err(Error::InvalidMilestoneStatus);
        }

        milestone.status = MilestoneStatus::Disputed;
        job.status = JobStatus::Disputed;

        env.storage()
            .persistent()
            .set(&DataKey::Milestone(job_id, milestone_id), &milestone);
        env.storage().persistent().set(&DataKey::Job(job_id), &job);

        env.events()
            .publish((symbol_short!("dispute"), job_id), milestone_id);

        Ok(())
    }

    /// Admin resolves a disputed milestone.
    /// - RefundClient: milestone amount goes back to client
    /// - PayFreelancer: milestone amount (minus fee) goes to freelancer
    /// - Split: 50/50 split between client and freelancer (fee deducted from freelancer's half)
    pub fn resolve_dispute(
        env: Env,
        job_id: u64,
        milestone_id: u32,
        resolution: DisputeResolution,
    ) -> Result<(), Error> {
        Self::require_initialized(&env)?;
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let mut job = Self::load_job(&env, job_id)?;
        if job.status != JobStatus::Disputed {
            return Err(Error::JobNotDisputed);
        }

        let mut milestone = Self::load_milestone(&env, job_id, milestone_id)?;
        if milestone.status != MilestoneStatus::Disputed {
            return Err(Error::InvalidMilestoneStatus);
        }

        let token_client = token::Client::new(&env, &job.token);
        let fee_bps: u32 = env
            .storage()
            .instance()
            .get(&DataKey::PlatformFeeBps)
            .unwrap_or(0);

        match resolution {
            DisputeResolution::RefundClient => {
                // Full refund to client, no fee
                token_client.transfer(
                    &env.current_contract_address(),
                    &job.client,
                    &milestone.amount,
                );
                milestone.status = MilestoneStatus::Rejected;
            }
            DisputeResolution::PayFreelancer => {
                // Pay freelancer minus fee
                let fee = (milestone.amount * fee_bps as i128) / 10_000;
                let net = milestone.amount - fee;
                token_client.transfer(&env.current_contract_address(), &job.freelancer, &net);
                if fee > 0 {
                    token_client.transfer(&env.current_contract_address(), &admin, &fee);
                }
                milestone.status = MilestoneStatus::Approved;
                job.completed_milestones += 1;
            }
            DisputeResolution::Split => {
                // 50/50 split
                let half = milestone.amount / 2;
                let remainder = milestone.amount - half; // handles odd amounts
                // Client gets half, no fee
                token_client.transfer(&env.current_contract_address(), &job.client, &half);
                // Freelancer gets remainder minus fee
                let fee = (remainder * fee_bps as i128) / 10_000;
                let net = remainder - fee;
                token_client.transfer(&env.current_contract_address(), &job.freelancer, &net);
                if fee > 0 {
                    token_client.transfer(&env.current_contract_address(), &admin, &fee);
                }
                milestone.status = MilestoneStatus::Rejected;
            }
        }

        // Save milestone
        env.storage()
            .persistent()
            .set(&DataKey::Milestone(job_id, milestone_id), &milestone);

        // Check if all milestones are resolved — if yes, mark job complete or cancelled
        let all_resolved = Self::all_milestones_resolved(&env, &job);
        if all_resolved {
            if job.completed_milestones == job.milestone_count {
                job.status = JobStatus::Completed;
            } else {
                // Some were rejected, some approved — mark completed
                job.status = JobStatus::Completed;
            }
        } else {
            // Still have pending milestones, return to InProgress
            job.status = JobStatus::InProgress;
        }

        env.storage().persistent().set(&DataKey::Job(job_id), &job);

        env.events().publish(
            (symbol_short!("resolve"), job_id, milestone_id),
            resolution as u32,
        );

        Ok(())
    }

    // ═══════════════════════════════════════════════════════════════════════
    // CANCELLATION
    // ═══════════════════════════════════════════════════════════════════════

    /// Client cancels an open job (before any freelancer accepts).
    /// Full deposit is refunded.
    pub fn cancel_job(env: Env, client: Address, job_id: u64) -> Result<(), Error> {
        Self::require_initialized(&env)?;
        client.require_auth();

        let mut job = Self::load_job(&env, job_id)?;
        if job.client != client {
            return Err(Error::NotClient);
        }
        if job.status != JobStatus::Open {
            return Err(Error::InvalidJobStatus);
        }

        // Refund full amount to client
        let token_client = token::Client::new(&env, &job.token);
        token_client.transfer(&env.current_contract_address(), &client, &job.total_amount);

        job.status = JobStatus::Cancelled;
        env.storage().persistent().set(&DataKey::Job(job_id), &job);

        env.events()
            .publish((symbol_short!("job_can"), client), job_id);

        Ok(())
    }

    // ═══════════════════════════════════════════════════════════════════════
    // QUERY FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════

    pub fn get_job(env: Env, job_id: u64) -> Result<Job, Error> {
        Self::load_job(&env, job_id)
    }

    pub fn get_milestone(env: Env, job_id: u64, milestone_id: u32) -> Result<Milestone, Error> {
        Self::load_milestone(&env, job_id, milestone_id)
    }

    pub fn get_platform_fee(env: Env) -> Result<u32, Error> {
        Self::require_initialized(&env)?;
        Ok(env
            .storage()
            .instance()
            .get(&DataKey::PlatformFeeBps)
            .unwrap_or(0))
    }

    pub fn get_job_count(env: Env) -> u64 {
        env.storage()
            .instance()
            .get(&DataKey::JobCount)
            .unwrap_or(0)
    }

    /// Get admin address
    pub fn get_admin(env: Env) -> Result<Address, Error> {
        Self::require_initialized(&env)?;
        Ok(env.storage().instance().get(&DataKey::Admin).unwrap())
    }

    /// Get all milestones for a job
    pub fn get_all_milestones(env: Env, job_id: u64) -> Result<Vec<Milestone>, Error> {
        let job = Self::load_job(&env, job_id)?;
        let mut milestones = Vec::new(&env);
        for i in 0..job.milestone_count {
            let ms = Self::load_milestone(&env, job_id, i)?;
            milestones.push_back(ms);
        }
        Ok(milestones)
    }

    // ═══════════════════════════════════════════════════════════════════════
    // ADDITIONAL FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════

    /// Client rejects a submitted milestone — sends it back to Pending for freelancer to redo.
    pub fn reject_milestone(
        env: Env,
        client: Address,
        job_id: u64,
        milestone_id: u32,
    ) -> Result<(), Error> {
        Self::require_initialized(&env)?;
        client.require_auth();

        let job = Self::load_job(&env, job_id)?;
        if job.client != client {
            return Err(Error::NotClient);
        }
        if job.status != JobStatus::InProgress {
            return Err(Error::InvalidJobStatus);
        }

        let mut milestone = Self::load_milestone(&env, job_id, milestone_id)?;
        if milestone.status != MilestoneStatus::Submitted {
            return Err(Error::MilestoneNotSubmitted);
        }

        milestone.status = MilestoneStatus::Pending;
        milestone.submitted_at = 0;

        env.storage()
            .persistent()
            .set(&DataKey::Milestone(job_id, milestone_id), &milestone);

        env.events()
            .publish((symbol_short!("ms_rej"), job_id), milestone_id);

        Ok(())
    }

    /// Admin updates platform fee (basis points). Max 10%.
    pub fn update_platform_fee(env: Env, new_fee_bps: u32) -> Result<(), Error> {
        Self::require_initialized(&env)?;
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        if new_fee_bps > 1000 {
            return Err(Error::InvalidFee);
        }

        env.storage()
            .instance()
            .set(&DataKey::PlatformFeeBps, &new_fee_bps);
        env.storage().instance().extend_ttl(30 * DAY, 60 * DAY);

        env.events()
            .publish((symbol_short!("fee_upd"),), new_fee_bps);

        Ok(())
    }

    /// Admin transfers admin role to a new address
    pub fn transfer_admin(env: Env, new_admin: Address) -> Result<(), Error> {
        Self::require_initialized(&env)?;
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        env.storage().instance().set(&DataKey::Admin, &new_admin);
        env.storage().instance().extend_ttl(30 * DAY, 60 * DAY);

        env.events()
            .publish((symbol_short!("admin"),), new_admin);

        Ok(())
    }

    // ═══════════════════════════════════════════════════════════════════════
    // INTERNAL HELPERS
    // ═══════════════════════════════════════════════════════════════════════

    fn require_initialized(env: &Env) -> Result<(), Error> {
        if !env.storage().instance().has(&DataKey::Initialized) {
            return Err(Error::NotInitialized);
        }
        Ok(())
    }

    fn load_job(env: &Env, job_id: u64) -> Result<Job, Error> {
        env.storage()
            .persistent()
            .get(&DataKey::Job(job_id))
            .ok_or(Error::JobNotFound)
    }

    fn load_milestone(env: &Env, job_id: u64, milestone_id: u32) -> Result<Milestone, Error> {
        env.storage()
            .persistent()
            .get(&DataKey::Milestone(job_id, milestone_id))
            .ok_or(Error::MilestoneNotFound)
    }

    fn all_milestones_resolved(env: &Env, job: &Job) -> bool {
        for i in 0..job.milestone_count {
            if let Some(ms) = env
                .storage()
                .persistent()
                .get::<DataKey, Milestone>(&DataKey::Milestone(job.id, i))
            {
                match ms.status {
                    MilestoneStatus::Pending | MilestoneStatus::Submitted | MilestoneStatus::Disputed => {
                        return false;
                    }
                    _ => {}
                }
            }
        }
        true
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════════════════════════════════════
#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{
        testutils::{Address as _, Ledger, LedgerInfo},
        token::{StellarAssetClient, TokenClient},
        vec, Env, String,
    };

    // ── Test helpers ────────────────────────────────────────────────────────

    fn setup_env() -> (
        Env,
        Address,   // contract_id
        Address,   // admin
        Address,   // token_address
        Address,   // client
        Address,   // freelancer
    ) {
        let env = Env::default();
        env.mock_all_auths();

        // Set ledger timestamp
        env.ledger().set(LedgerInfo {
            timestamp: 1000,
            protocol_version: 25,
            sequence_number: 100,
            network_id: [0u8; 32],
            base_reserve: 10,
            min_temp_entry_ttl: 100,
            min_persistent_entry_ttl: 100,
            max_entry_ttl: 10_000_000,
        });

        let contract_id = env.register(FreelanceEscrow, ());
        let admin = Address::generate(&env);
        let client = Address::generate(&env);
        let freelancer = Address::generate(&env);

        // Create a test token (SAC)
        let token_admin = Address::generate(&env);
        let token_address = env.register_stellar_asset_contract_v2(token_admin.clone()).address();
        let sac_client = StellarAssetClient::new(&env, &token_address);

        // Mint tokens to client for escrow deposit
        sac_client.mint(&client, &100_000_000); // 100M stroops

        (env, contract_id, admin, token_address, client, freelancer)
    }

    fn init_contract(env: &Env, contract_id: &Address, admin: &Address) {
        let escrow = FreelanceEscrowClient::new(env, contract_id);
        escrow.initialize(admin, &250); // 2.5% fee
    }

    fn create_test_job(
        env: &Env,
        contract_id: &Address,
        client: &Address,
        token: &Address,
    ) -> u64 {
        let escrow = FreelanceEscrowClient::new(env, contract_id);
        let milestones = vec![
            env,
            MilestoneInput {
                description: String::from_str(env, "Design mockups"),
                amount: 1_000_000,
            },
            MilestoneInput {
                description: String::from_str(env, "Frontend dev"),
                amount: 2_000_000,
            },
            MilestoneInput {
                description: String::from_str(env, "Testing & deploy"),
                amount: 1_000_000,
            },
        ];
        escrow.create_job(client, token, &milestones, &2000)
    }

    // ── Tests ────────────────────────────────────────────────────────────────

    #[test]
    fn test_full_happy_path() {
        let (env, contract_id, admin, token, client, freelancer) = setup_env();
        init_contract(&env, &contract_id, &admin);
        let escrow = FreelanceEscrowClient::new(&env, &contract_id);
        let token_client = TokenClient::new(&env, &token);

        // Verify client initial balance
        let initial_balance = token_client.balance(&client);

        // Create job (3 milestones, total 4M stroops)
        let job_id = create_test_job(&env, &contract_id, &client, &token);
        assert_eq!(job_id, 1);

        // 4M should be escrowed
        assert_eq!(
            token_client.balance(&client),
            initial_balance - 4_000_000
        );
        assert_eq!(token_client.balance(&contract_id), 4_000_000);

        // Freelancer accepts
        escrow.accept_job(&freelancer, &job_id);
        let job = escrow.get_job(&job_id);
        assert_eq!(job.status, JobStatus::InProgress);
        assert_eq!(job.freelancer, freelancer);

        // Submit & approve all 3 milestones
        for ms_id in 0..3_u32 {
            escrow.submit_milestone(&freelancer, &job_id, &ms_id);
            escrow.approve_milestone(&client, &job_id, &ms_id);
        }

        // Job should be completed
        let job = escrow.get_job(&job_id);
        assert_eq!(job.status, JobStatus::Completed);
        assert_eq!(job.completed_milestones, 3);

        // Verify freelancer got paid (total 4M - 2.5% fee = 3,900,000)
        assert_eq!(token_client.balance(&freelancer), 3_900_000);

        // Admin collected 100,000 in fees
        assert_eq!(token_client.balance(&admin), 100_000);

        // Escrow should be empty
        assert_eq!(token_client.balance(&contract_id), 0);
    }

    #[test]
    fn test_cancel_open_job() {
        let (env, contract_id, admin, token, client, _freelancer) = setup_env();
        init_contract(&env, &contract_id, &admin);
        let escrow = FreelanceEscrowClient::new(&env, &contract_id);
        let token_client = TokenClient::new(&env, &token);

        let initial_balance = token_client.balance(&client);
        let job_id = create_test_job(&env, &contract_id, &client, &token);

        // Cancel before anyone accepts
        escrow.cancel_job(&client, &job_id);

        // Full refund
        assert_eq!(token_client.balance(&client), initial_balance);

        // Job status is cancelled
        let job = escrow.get_job(&job_id);
        assert_eq!(job.status, JobStatus::Cancelled);
    }

    #[test]
    #[should_panic(expected = "Error(Contract, #9)")] // InvalidJobStatus
    fn test_cannot_cancel_in_progress_job() {
        let (env, contract_id, admin, token, client, freelancer) = setup_env();
        init_contract(&env, &contract_id, &admin);
        let escrow = FreelanceEscrowClient::new(&env, &contract_id);

        let job_id = create_test_job(&env, &contract_id, &client, &token);
        escrow.accept_job(&freelancer, &job_id);

        // This should fail — job is InProgress
        escrow.cancel_job(&client, &job_id);
    }

    #[test]
    fn test_dispute_resolve_refund_client() {
        let (env, contract_id, admin, token, client, freelancer) = setup_env();
        init_contract(&env, &contract_id, &admin);
        let escrow = FreelanceEscrowClient::new(&env, &contract_id);
        let token_client = TokenClient::new(&env, &token);

        let initial_balance = token_client.balance(&client);
        let job_id = create_test_job(&env, &contract_id, &client, &token);

        escrow.accept_job(&freelancer, &job_id);
        escrow.submit_milestone(&freelancer, &job_id, &0);

        // Client disputes milestone 0
        escrow.raise_dispute(&client, &job_id, &0);
        let job = escrow.get_job(&job_id);
        assert_eq!(job.status, JobStatus::Disputed);

        // Admin resolves: refund client
        escrow.resolve_dispute(&job_id, &0, &DisputeResolution::RefundClient);

        // Client got milestone 0 amount back (1M)
        assert_eq!(
            token_client.balance(&client),
            initial_balance - 3_000_000 // only milestones 1 & 2 still escrowed
        );

        // Job should be back to InProgress (still has pending milestones)
        let job = escrow.get_job(&job_id);
        assert_eq!(job.status, JobStatus::InProgress);
    }

    #[test]
    fn test_dispute_resolve_pay_freelancer() {
        let (env, contract_id, admin, token, client, freelancer) = setup_env();
        init_contract(&env, &contract_id, &admin);
        let escrow = FreelanceEscrowClient::new(&env, &contract_id);
        let token_client = TokenClient::new(&env, &token);

        let job_id = create_test_job(&env, &contract_id, &client, &token);
        escrow.accept_job(&freelancer, &job_id);
        escrow.submit_milestone(&freelancer, &job_id, &0);

        // Freelancer disputes (maybe client not responding)
        escrow.raise_dispute(&freelancer, &job_id, &0);

        // Admin resolves: pay freelancer
        escrow.resolve_dispute(&job_id, &0, &DisputeResolution::PayFreelancer);

        // Freelancer got milestone 0 payment (1M - 2.5% = 975,000)
        assert_eq!(token_client.balance(&freelancer), 975_000);
        assert_eq!(token_client.balance(&admin), 25_000);

        let job = escrow.get_job(&job_id);
        assert_eq!(job.completed_milestones, 1);
        assert_eq!(job.status, JobStatus::InProgress);
    }

    #[test]
    fn test_dispute_resolve_split() {
        let (env, contract_id, admin, token, client, freelancer) = setup_env();
        init_contract(&env, &contract_id, &admin);
        let escrow = FreelanceEscrowClient::new(&env, &contract_id);
        let token_client = TokenClient::new(&env, &token);

        let job_id = create_test_job(&env, &contract_id, &client, &token);
        escrow.accept_job(&freelancer, &job_id);
        escrow.submit_milestone(&freelancer, &job_id, &0);
        escrow.raise_dispute(&client, &job_id, &0);

        // Admin resolves: 50/50 split
        escrow.resolve_dispute(&job_id, &0, &DisputeResolution::Split);

        // Milestone 0 = 1,000,000
        // Client gets 500,000 (no fee on client's half)
        // Freelancer gets 500,000 - 2.5% = 487,500
        // Admin gets fee = 12,500
        assert_eq!(token_client.balance(&freelancer), 487_500);
        assert_eq!(token_client.balance(&admin), 12_500);
    }

    #[test]
    fn test_platform_fee_calculation() {
        let (env, contract_id, admin, token, client, freelancer) = setup_env();
        init_contract(&env, &contract_id, &admin);
        let escrow = FreelanceEscrowClient::new(&env, &contract_id);
        let token_client = TokenClient::new(&env, &token);

        let job_id = create_test_job(&env, &contract_id, &client, &token);
        escrow.accept_job(&freelancer, &job_id);

        // Approve milestone 1 (amount = 2,000,000)
        escrow.submit_milestone(&freelancer, &job_id, &1);
        escrow.approve_milestone(&client, &job_id, &1);

        // 2.5% of 2,000,000 = 50,000
        assert_eq!(token_client.balance(&admin), 50_000);
        assert_eq!(token_client.balance(&freelancer), 1_950_000);

        // Fee query
        assert_eq!(escrow.get_platform_fee(), 250);
    }

    #[test]
    #[should_panic(expected = "Error(Contract, #5)")] // NotFreelancer
    fn test_wrong_freelancer_cannot_submit() {
        let (env, contract_id, admin, token, client, freelancer) = setup_env();
        init_contract(&env, &contract_id, &admin);
        let escrow = FreelanceEscrowClient::new(&env, &contract_id);

        let job_id = create_test_job(&env, &contract_id, &client, &token);
        escrow.accept_job(&freelancer, &job_id);

        // Random person tries to submit — should fail
        let stranger = Address::generate(&env);
        escrow.submit_milestone(&stranger, &job_id, &0);
    }

    #[test]
    #[should_panic(expected = "Error(Contract, #16)")] // MilestoneAlreadySubmitted
    fn test_double_submit_milestone() {
        let (env, contract_id, admin, token, client, freelancer) = setup_env();
        init_contract(&env, &contract_id, &admin);
        let escrow = FreelanceEscrowClient::new(&env, &contract_id);

        let job_id = create_test_job(&env, &contract_id, &client, &token);
        escrow.accept_job(&freelancer, &job_id);

        // Submit milestone 0 twice — second should fail
        escrow.submit_milestone(&freelancer, &job_id, &0);
        escrow.submit_milestone(&freelancer, &job_id, &0);
    }

    #[test]
    fn test_multiple_milestones_sequential() {
        let (env, contract_id, admin, token, client, freelancer) = setup_env();
        init_contract(&env, &contract_id, &admin);
        let escrow = FreelanceEscrowClient::new(&env, &contract_id);
        let token_client = TokenClient::new(&env, &token);

        let job_id = create_test_job(&env, &contract_id, &client, &token);
        escrow.accept_job(&freelancer, &job_id);

        // Process milestones one by one
        // MS 0: 1,000,000
        escrow.submit_milestone(&freelancer, &job_id, &0);
        escrow.approve_milestone(&client, &job_id, &0);
        let job = escrow.get_job(&job_id);
        assert_eq!(job.completed_milestones, 1);
        assert_eq!(job.status, JobStatus::InProgress);

        // MS 1: 2,000,000
        escrow.submit_milestone(&freelancer, &job_id, &1);
        escrow.approve_milestone(&client, &job_id, &1);
        let job = escrow.get_job(&job_id);
        assert_eq!(job.completed_milestones, 2);
        assert_eq!(job.status, JobStatus::InProgress);

        // MS 2: 1,000,000 — last one
        escrow.submit_milestone(&freelancer, &job_id, &2);
        escrow.approve_milestone(&client, &job_id, &2);
        let job = escrow.get_job(&job_id);
        assert_eq!(job.completed_milestones, 3);
        assert_eq!(job.status, JobStatus::Completed);

        // Total paid to freelancer: 4,000,000 - 2.5% = 3,900,000
        assert_eq!(token_client.balance(&freelancer), 3_900_000);
        assert_eq!(token_client.balance(&contract_id), 0);
    }
}
