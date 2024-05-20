import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EventPublisher } from '@nestjs/cqrs';
import { ISecurityConfig, SecurityConfig } from '@src/config';
import { UserReadRepoPortToken } from '../../constants';
import { UserReadRepoPort } from '../../ports/user-read.repo-port';
import { UserModel } from '../../domain/user.model';
import { PasswordIdentifierDTO } from '../../application/dto/password-identifier.dto';
import { UserLoggedInEvent } from '../../domain/events/user-logged-in.event';

@Injectable()
export class AuthenticationService {
  constructor(
    private jwtService: JwtService,
    private readonly publisher: EventPublisher,
    @Inject(UserReadRepoPortToken)
    private readonly repository: UserReadRepoPort,
    @Inject(SecurityConfig.KEY) private securityConfig: ISecurityConfig,
  ) {}

  async execPasswordLogin(
    dto: PasswordIdentifierDTO,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { identifier, password } = dto;
    const user = await this.repository.findUserByIdentifier(identifier);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    const userAggregate = new UserModel(user);
    const loginResult = await userAggregate.loginUser(password);

    if (!loginResult.success) {
      throw new UnauthorizedException(loginResult.message);
    }

    const tokens = await this.generateAccessToken(
      user.id,
      user.username,
      user.domain,
    );

    userAggregate.apply(
      new UserLoggedInEvent(
        user.id,
        user.username,
        user.domain,
        dto.ip,
        dto.address,
        dto.userAgent,
        dto.requestId,
        dto.type,
        dto.port,
      ),
    );
    this.publisher.mergeObjectContext(userAggregate);
    userAggregate.commit();

    return tokens;
  }

  private async generateAccessToken(
    userId: string,
    username: string,
    domain: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: IAuthentication = {
      uid: userId,
      username: username,
      domain: domain,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.securityConfig.refreshJwtSecret,
      expiresIn: this.securityConfig.refreshJwtExpiresIn,
    });

    return { accessToken, refreshToken };
  }
}
