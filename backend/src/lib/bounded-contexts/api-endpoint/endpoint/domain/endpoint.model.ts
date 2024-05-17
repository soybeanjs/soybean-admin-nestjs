export class SysEndpoint {
  id: string;
  path: string;
  method: string;
  action: string;
  resource: string;
  controller: string;
  summary?: string;

  constructor(
    id: string,
    path: string,
    method: string,
    action: string,
    resource: string,
    controller: string,
    summary?: string,
  ) {
    this.id = id;
    this.path = path;
    this.method = method;
    this.action = action;
    this.resource = resource;
    this.controller = controller;
    this.summary = summary;
  }
}
