declare namespace NodeJS {
  interface ProcessEnv {
    /** The environment in which the application is running. */
    NODE_ENV: 'development' | 'production';
    /** The port on which the application should listen. */
    PORT: string;
    /** The name of the application. */
    APP_NAME: string;
  }
}
