export interface RoleReadRepoPort {
  findRolesByUserId(userId: string): Promise<Set<string>>;
}
