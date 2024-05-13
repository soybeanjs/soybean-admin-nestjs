export class PasswordIdentifierDTO {
  constructor(
    public readonly identifier: string,
    public readonly password: string,
  ) {}
}
