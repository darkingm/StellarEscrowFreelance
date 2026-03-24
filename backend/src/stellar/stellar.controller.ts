import { Controller, Get } from '@nestjs/common';
import { StellarService } from './stellar.service';

@Controller('stellar')
export class StellarController {
    constructor(private readonly stellarService: StellarService) { }

    @Get('contract')
    getContractInfo() {
        return {
            contractId: this.stellarService.getContractId(),
            rpcUrl: this.stellarService.getRpcUrl(),
            explorerUrl: this.stellarService.getExplorerUrl('contract', this.stellarService.getContractId()),
            network: 'testnet',
        };
    }

    @Get('fee')
    async getPlatformFee() {
        const fee = await this.stellarService.getPlatformFee();
        return { feeBps: fee, feePercent: `${fee / 100}%` };
    }

    @Get('stats')
    async getStats() {
        const jobCount = await this.stellarService.getJobCount();
        const fee = await this.stellarService.getPlatformFee();
        return {
            totalJobs: jobCount,
            platformFeeBps: fee,
            network: 'Stellar Testnet',
            contractId: this.stellarService.getContractId(),
        };
    }
}
