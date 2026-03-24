import { Controller, Get, Param, Patch, Body } from '@nestjs/common';

const USERS: Record<string, any> = {
    'GBO33XNOTQGGXIHXNG6LOMUERDKJTAOPMLXMF742XBL6SIMVEK67NWTC': {
        walletAddress: 'GBO33XNOTQGGXIHXNG6LOMUERDKJTAOPMLXMF742XBL6SIMVEK67NWTC',
        displayName: 'Trần Nguyên Kiên',
        bio: 'Full-stack developer & Soroban smart contract engineer',
        rating: 4.8,
        jobsCompleted: 12,
        totalEarned: '48000000',
        activeJobs: 2,
        disputesLost: 0,
        createdAt: '2025-11-01',
    },
};

interface UpdateProfileDto {
    displayName?: string;
    bio?: string;
}

@Controller('users')
export class UsersController {
    @Get(':address')
    findOne(@Param('address') address: string) {
        const user = USERS[address];
        if (!user) {
            // Return a default profile for unknown addresses
            return {
                walletAddress: address,
                displayName: null,
                bio: null,
                rating: 0,
                jobsCompleted: 0,
                totalEarned: '0',
                activeJobs: 0,
                disputesLost: 0,
                createdAt: new Date().toISOString(),
            };
        }
        return user;
    }

    @Patch('me')
    updateProfile(@Body() dto: UpdateProfileDto) {
        return {
            message: 'Profile updated',
            ...dto,
        };
    }
}
