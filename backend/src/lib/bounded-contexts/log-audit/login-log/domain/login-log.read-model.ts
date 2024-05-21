export type LoginLogEssentialProperties = Readonly<
  Required<{
    username: string;
    domain: string;
    loginTime: Date;
    ip: string;
    port: number | null;
    address: string;
    userAgent: string;
    requestId: string;
    type: string;
    createdAt: Date;
  }>
>;

export type LoginLogProperties = LoginLogEssentialProperties;
