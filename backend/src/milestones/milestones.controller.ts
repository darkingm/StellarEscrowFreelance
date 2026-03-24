import { Controller, Get, Param, Patch, Body } from '@nestjs/common';

const MILESTONES: Record<string, any[]> = {
    '1': [
        { id: 0, jobId: 1, description: 'Design Mockups', amount: '1000000', status: 'Approved', submittedAt: '2026-03-22', approvedAt: '2026-03-23' },
        { id: 1, jobId: 1, description: 'Frontend Development', amount: '2000000', status: 'Approved', submittedAt: '2026-03-25', approvedAt: '2026-03-26' },
        { id: 2, jobId: 1, description: 'Testing & Deployment', amount: '1000000', status: 'Submitted', submittedAt: '2026-03-28', approvedAt: null },
    ],
    '3': [
        { id: 0, jobId: 3, description: 'Architecture Review', amount: '2500000', status: 'Approved', submittedAt: '2026-03-12', approvedAt: '2026-03-13' },
        { id: 1, jobId: 3, description: 'Security Audit', amount: '3000000', status: 'Approved', submittedAt: '2026-03-15', approvedAt: '2026-03-16' },
        { id: 2, jobId: 3, description: 'Gas Optimization', amount: '2000000', status: 'Approved', submittedAt: '2026-03-20', approvedAt: '2026-03-21' },
        { id: 3, jobId: 3, description: 'Final Report', amount: '2500000', status: 'Approved', submittedAt: '2026-03-25', approvedAt: '2026-03-26' },
    ],
};

@Controller('milestones')
export class MilestonesController {
    @Get('job/:jobId')
    findByJob(@Param('jobId') jobId: string) {
        return { data: MILESTONES[jobId] || [], jobId: parseInt(jobId) };
    }

    @Patch(':jobId/:milestoneId/submit')
    submit(@Param('jobId') jobId: string, @Param('milestoneId') milestoneId: string) {
        return { message: 'Milestone submitted — sign transaction with Freighter', jobId, milestoneId };
    }

    @Patch(':jobId/:milestoneId/approve')
    approve(@Param('jobId') jobId: string, @Param('milestoneId') milestoneId: string) {
        return { message: 'Milestone approved — funds released to freelancer', jobId, milestoneId };
    }

    @Patch(':jobId/:milestoneId/reject')
    reject(@Param('jobId') jobId: string, @Param('milestoneId') milestoneId: string) {
        return { message: 'Milestone rejected — sent back to freelancer for revision', jobId, milestoneId };
    }
}
