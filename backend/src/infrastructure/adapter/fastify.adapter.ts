import {FastifyAdapter} from '@nestjs/platform-fastify';
import fastifyMultipart from '@fastify/multipart';

const app: FastifyAdapter = new FastifyAdapter({
  logger: false,
});
export { app as fastifyApp };

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
app.register(fastifyMultipart, {
  limits: {
    fields: 10, // Max number of non-file fields
    fileSize: 1024 * 1024 * 6, // limit size 6M
    files: 5, // Max number of file fields
  },
});
