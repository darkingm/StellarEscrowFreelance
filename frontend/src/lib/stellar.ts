// Stellar SDK integration for the FreelanceEscrow dApp
// This module handles wallet connection and contract interaction

export const CONTRACT_ID = "CA7VKPOTYB2QQKMZ3W5L4L236PWGXQDJUE5LFEU225LA5RH2RWHNFREB";
export const RPC_URL = "https://soroban-testnet.stellar.org";
export const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";
export const EXPLORER_URL = "https://stellar.expert/explorer/testnet";

export function shortenAddress(addr: string, chars = 6): string {
    if (!addr) return "";
    return `${addr.slice(0, chars)}...${addr.slice(-chars)}`;
}

export function formatAmount(stroops: bigint | number): string {
    const val = Number(stroops) / 10_000_000;
    return val.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export function getExplorerTxUrl(hash: string): string {
    return `${EXPLORER_URL}/tx/${hash}`;
}

export function getExplorerContractUrl(): string {
    return `${EXPLORER_URL}/contract/${CONTRACT_ID}`;
}

export type JobStatus = "Open" | "InProgress" | "Completed" | "Cancelled" | "Disputed";
export type MilestoneStatus = "Pending" | "Submitted" | "Approved" | "Disputed" | "Rejected";

export interface Job {
    id: number;
    client: string;
    freelancer: string;
    token: string;
    totalAmount: bigint;
    milestoneCount: number;
    completedMilestones: number;
    status: JobStatus;
    createdAt: number;
    deadline: number;
}

export interface Milestone {
    id: number;
    jobId: number;
    description: string;
    amount: bigint;
    status: MilestoneStatus;
    submittedAt: number;
    approvedAt: number;
}

// Job status mappings
export const JOB_STATUS_MAP: Record<number, JobStatus> = {
    0: "Open",
    1: "InProgress",
    2: "Completed",
    3: "Cancelled",
    4: "Disputed",
};

export const MILESTONE_STATUS_MAP: Record<number, MilestoneStatus> = {
    0: "Pending",
    1: "Submitted",
    2: "Approved",
    3: "Disputed",
    4: "Rejected",
};

export function getStatusBadgeClass(status: JobStatus | MilestoneStatus): string {
    const map: Record<string, string> = {
        Open: "badge-open",
        InProgress: "badge-progress",
        Completed: "badge-completed",
        Cancelled: "badge-cancelled",
        Disputed: "badge-disputed",
        Pending: "badge-pending",
        Submitted: "badge-submitted",
        Approved: "badge-approved",
        Rejected: "badge-cancelled",
    };
    return map[status] || "badge-open";
}
