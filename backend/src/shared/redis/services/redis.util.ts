import { Redis, Cluster } from 'ioredis';

import { RedisConfig } from '@src/config/redis.configuration';

export class RedisUtility {
  public static instance: Redis | Cluster;
  private static initializing: Promise<Redis | Cluster>;

  private static async createInstance(): Promise<Redis | Cluster> {
    const [config] = await Promise.all([RedisConfig()]);
    if (config.mode === 'cluster') {
      this.instance = new Redis.Cluster(
        config.cluster.map((node) => ({
          host: node.host,
          port: node.port,
          password: node.password,
        })),
        {
          redisOptions: {
            password: config.cluster[0].password,
            db: config.standalone.db,
          },
        },
      );
    } else {
      this.instance = new Redis({
        host: config.standalone.host,
        port: config.standalone.port,
        password: config.standalone.password,
        db: config.standalone.db,
      });
    }
    return this.instance;
  }

  public static async client(): Promise<Redis | Cluster> {
    if (!this.instance && !this.initializing) {
      this.initializing = this.createInstance();
      this.instance = await this.initializing;
    } else if (this.initializing) {
      await this.initializing;
    }
    return this.instance;
  }
}
