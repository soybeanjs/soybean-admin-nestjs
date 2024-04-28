declare namespace NodeJS {
  interface ProcessEnv {
    /** The environment in which the application is running. */
    NODE_ENV: 'dev' | 'prod';
    /** The host on which the application should listen. */
    HOST: string;
    /** The port on which the application should listen. */
    PORT: string;
    /** The name of the application. */
    APP_NAME: string;
    /** The database host. */
    DATABASE_HOST: string;
    /** The database port. */
    DATABASE_PORT: string;
  }
}
