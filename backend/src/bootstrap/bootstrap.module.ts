import { Module, Global } from '@nestjs/common';
import { ApiDataService } from '.';

@Global()
@Module({
  providers: [ApiDataService],
  exports: [ApiDataService],
})
export class BootstrapModule {}
