import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';

const DISPUTES = [
    {
        id: 1, jobId: 5, milestoneId: 2, raisedBy: 'GDKR4...WXTPN', raisedByRole: 'Client',
        reason: 'API endpoints trả về sai format, thiếu 3 endpoints theo spec ban đầu.',
        status: 'Active', createdAt: '2026-03-22', resolvedAt: null, resolution: null,
    },
    {
        id: 2, jobId: 3, milestoneId: 1, raisedBy: 'GBYZ3...QMKL2', raisedByRole: 'Freelancer',
        reason: 'Client không phản hồi milestone đã submit hơn 7 ngày.',
        status: 'Resolved', createdAt: '2026-03-15', resolvedAt: '2026-03-17', resolution: 'PayFreelancer',
    },
];

interface RaiseDisputeDto {
    jobId: number;
    milestoneId: number;
    raisedBy: string;
    reason: string;
}

interface ResolveDisputeDto {
    resolution: 'RefundClient' | 'PayFreelancer' | 'Split';
}

@Controller('disputes')
export class DisputesController {
    @Get()
    findAll() {
        return { data: DISPUTES, total: DISPUTES.length };
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        const dispute = DISPUTES.find(d => d.id === parseInt(id));
        if (!dispute) return { error: 'Dispute not found' };
        return dispute;
    }

    @Post()
    raise(@Body() dto: RaiseDisputeDto) {
        return {
            message: 'Dispute raised — sign transaction with Freighter to submit on-chain',
            dispute: { ...dto, id: DISPUTES.length + 1, status: 'Active', createdAt: new Date().toISOString() },
        };
    }

    @Patch(':id/resolve')
    resolve(@Param('id') id: string, @Body() dto: ResolveDisputeDto) {
        return {
            message: `Dispute resolved: ${dto.resolution} — sign admin transaction`,
            disputeId: parseInt(id),
            resolution: dto.resolution,
        };
    }
}
