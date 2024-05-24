import { Module } from '@nestjs/common';

import { MenuReadRepoPortToken } from '@src/lib/bounded-contexts/iam/menu/constants';
import { MenuModule } from '@src/lib/bounded-contexts/iam/menu/menu.module';

import { MenuReadPostgresRepository } from './repository/menu.read.pg.repository';

const providers = [
  { provide: MenuReadRepoPortToken, useClass: MenuReadPostgresRepository },
];

@Module({
  imports: [
    MenuModule.register({
      inject: [...providers],
      imports: [],
    }),
  ],
  exports: [MenuModule],
})
export class MenuInfraModule {}
