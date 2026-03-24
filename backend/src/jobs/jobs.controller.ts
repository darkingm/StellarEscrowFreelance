import { Controller, Get, Post, Body, Param, Patch, Query } from '@nestjs/common';

// DTO types
interface CreateJobDto {
    client: string;
    token: string;
    title: string;
    description: string;
    category: string;
    milestones: { description: string; amount: string }[];
    deadline: number;
}

interface AcceptJobDto {
    freelancer: string;
}

// Demo data store (in production: use database)
const JOBS: { id: number; contractJobId: number | null; title: string; description: string; category: string; token: string; totalAmount: string; client: string; freelancer: string | null; status: string; milestoneCount: number; completedMilestones: number; deadline: string; createdAt: string; txHash: string | null }[] = [
    {
        id: 1, contractJobId: 1, title: 'E-Commerce Website Redesign',
        description: 'Redesign toàn bộ giao diện e-commerce platform với React + Next.js',
        category: 'Web Development', token: 'native', totalAmount: '4000000',
        client: 'GDKR42NASDXHNG6LOMUERDKJTAOPMLXMF742XBLWXTPN',
        freelancer: 'GBYZ3QNOTQGGXIHXNG6LOMUERDKJTAOPMLXMF742QMKL2',
        status: 'InProgress', milestoneCount: 3, completedMilestones: 2,
        deadline: '2026-04-15', createdAt: '2026-03-20', txHash: '3cb4fc29dac64dd7',
    },
    {
        id: 2, contractJobId: 2, title: 'Mobile App UI/UX Design',
        description: 'Thiết kế giao diện ứng dụng mobile cho nền tảng DeFi',
        category: 'Design', token: 'native', totalAmount: '2500000',
        client: 'GDKR42NASDXHNG6LOMUERDKJTAOPMLXMF742XBLWXTPN',
        freelancer: null, status: 'Open', milestoneCount: 2, completedMilestones: 0,
        deadline: '2026-04-20', createdAt: '2026-03-22', txHash: null,
    },
    {
        id: 3, contractJobId: 3, title: 'Smart Contract Audit',
        description: 'Kiểm tra bảo mật và audit Soroban smart contract',
        category: 'Security', token: 'native', totalAmount: '10000000',
        client: 'GABCDEFGH12345KLMNOPQRSTUVWXYZ67890EFGH1',
        freelancer: 'GBYZ3QNOTQGGXIHXNG6LOMUERDKJTAOPMLXMF742QMKL2',
        status: 'Completed', milestoneCount: 4, completedMilestones: 4,
        deadline: '2026-03-30', createdAt: '2026-03-10', txHash: 'a1b2c3d4e5f67890',
    },
];

@Controller('jobs')
export class JobsController {
    @Get()
    findAll(
        @Query('status') status?: string,
        @Query('category') category?: string,
        @Query('search') search?: string,
    ) {
        let result = [...JOBS];
        if (status) result = result.filter(j => j.status === status);
        if (category) result = result.filter(j => j.category === category);
        if (search) result = result.filter(j =>
            j.title.toLowerCase().includes(search.toLowerCase()) ||
            j.description.toLowerCase().includes(search.toLowerCase())
        );
        return { data: result, total: result.length };
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        const job = JOBS.find(j => j.id === parseInt(id));
        if (!job) return { error: 'Job not found' };
        return job;
    }

    @Post()
    create(@Body() dto: CreateJobDto) {
        const newJob = {
            id: JOBS.length + 1,
            contractJobId: null,
            title: dto.title,
            description: dto.description,
            category: dto.category,
            token: dto.token,
            totalAmount: dto.milestones.reduce((sum, m) => sum + parseInt(m.amount), 0).toString(),
            client: dto.client,
            freelancer: null,
            status: 'Open',
            milestoneCount: dto.milestones.length,
            completedMilestones: 0,
            deadline: new Date(dto.deadline * 1000).toISOString().split('T')[0],
            createdAt: new Date().toISOString().split('T')[0],
            txHash: null,
        };
        JOBS.push(newJob);
        return { data: newJob, message: 'Job created — sign transaction with Freighter to deploy on-chain' };
    }

    @Patch(':id/accept')
    accept(@Param('id') id: string, @Body() dto: AcceptJobDto) {
        const job = JOBS.find(j => j.id === parseInt(id));
        if (!job) return { error: 'Job not found' };
        if (job.status !== 'Open') return { error: 'Job is not open' };
        job.freelancer = dto.freelancer;
        job.status = 'InProgress';
        return { data: job, message: 'Job accepted — sign transaction to confirm on-chain' };
    }
}
