import { Controller, Post, Body, Get, Param } from '@nestjs/common';

interface ChallengeDto {
    walletAddress: string;
}

interface VerifyDto {
    walletAddress: string;
    signedChallenge: string;
}

// Simple in-memory challenges (production: use Redis/DB)
const challenges = new Map<string, string>();

@Controller('auth')
export class AuthController {
    @Post('challenge')
    createChallenge(@Body() dto: ChallengeDto) {
        const challenge = `FreelanceEscrow-Auth-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        challenges.set(dto.walletAddress, challenge);
        return { challenge, walletAddress: dto.walletAddress };
    }

    @Post('verify')
    verify(@Body() dto: VerifyDto) {
        const expected = challenges.get(dto.walletAddress);
        if (!expected) {
            return { error: 'No challenge found. Request a new challenge first.' };
        }
        // In production: verify the signature using @stellar/stellar-sdk
        // For now, accept any signature for demo purposes
        challenges.delete(dto.walletAddress);
        return {
            token: `jwt_${dto.walletAddress}_${Date.now()}`,
            walletAddress: dto.walletAddress,
            expiresIn: '24h',
        };
    }

    @Get('me')
    getProfile() {
        // In production: decode JWT from Authorization header
        return {
            walletAddress: 'GBO33XNOTQGGXIHXNG6LOMUERDKJTAOPMLXMF742XBL6SIMVEK67NWTC',
            displayName: 'Trần Nguyên Kiên',
            role: 'admin',
        };
    }
}
