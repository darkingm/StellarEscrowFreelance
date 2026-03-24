import { Module } from '@nestjs/common';
import { StellarModule } from './stellar/stellar.module';
import { AuthModule } from './auth/auth.module';
import { JobsModule } from './jobs/jobs.module';
import { MilestonesModule } from './milestones/milestones.module';
import { DisputesModule } from './disputes/disputes.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    StellarModule,
    AuthModule,
    JobsModule,
    MilestonesModule,
    DisputesModule,
    UsersModule,
  ],
})
export class AppModule { }
