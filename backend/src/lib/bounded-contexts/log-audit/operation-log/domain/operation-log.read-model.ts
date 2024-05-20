export interface OperationLogProperties {
  userId: string;
  username: string;
  domain: string;
  moduleName: string;
  description: string;
  requestId: string;
  method: string;
  url: string;
  ip: string;
  userAgent: string;
  params: any;
  body: any;
  response: any;
  startTime: Date;
  endTime: Date;
  duration: number;
}
