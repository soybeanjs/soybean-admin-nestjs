export enum AuthActionVerb {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  READ = 'read',
}

export type CustomAuthActionVerb = string;

export enum AuthPossession {
  ANY = 'any',
  OWN = 'own',
  OWN_ANY = 'own|any',
}
