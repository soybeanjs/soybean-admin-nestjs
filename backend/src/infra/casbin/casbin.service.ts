import { Injectable, OnModuleInit } from '@nestjs/common';
import { Enforcer, newEnforcer } from 'casbin';
import { PrismaAdapter } from '@src/infra/adapter/casbin-prisma.adapter';

@Injectable()
export class CasbinService implements OnModuleInit {
  private enforcer: Enforcer;

  async onModuleInit(): Promise<void> {
    const adapter = await PrismaAdapter.newAdapter();
    this.enforcer = await newEnforcer(
      'src/infra/casbin/config/model.conf',
      adapter,
    );
  }

  async getEnforcer(): Promise<Enforcer> {
    if (!this.enforcer) {
      throw new Error('Casbin enforcer is not initialized');
    }
    return this.enforcer;
  }

  async loadPolicy() {
    await this.enforcer.loadPolicy();
  }
}
