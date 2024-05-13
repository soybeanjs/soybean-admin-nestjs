import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { PrismaModule } from './prisma/prisma.module';
import { CacheManagerModule } from './cache-manager/cache-manager.module';

@Global()
@Module({
  imports: [
    // http
    HttpModule,
    // schedule
    ScheduleModule.forRoot(),
    // rate limit
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 20,
      ignoreErrors: false,
    }),
    // prisma
    PrismaModule,
    CacheManagerModule,
  ],
  exports: [HttpModule, PrismaModule, CacheManagerModule],
})
export class SharedModule {}
