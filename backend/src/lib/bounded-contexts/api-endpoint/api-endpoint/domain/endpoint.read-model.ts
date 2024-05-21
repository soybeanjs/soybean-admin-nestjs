export type EndpointEssentialProperties = Readonly<
  Required<{
    id: string;
    path: string;
    method: string;
    action: string;
    resource: string;
    controller: string;
    summary: string | null;
    createdAt: Date;
    updatedAt: Date | null;
  }>
>;

export type EndpointProperties = EndpointEssentialProperties;
