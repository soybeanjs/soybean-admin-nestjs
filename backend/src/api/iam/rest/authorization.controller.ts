import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AssignPermissionDto } from '@src/api/iam/dto/assign-permission.dto';
import { AuthorizationService } from '@src/lib/bounded-contexts/iam/authentication/application/service/authorization.service';
import { RoleAssignPermissionCommand } from '@src/lib/bounded-contexts/iam/authentication/commands/role-assign-permission.command';

@ApiTags('Authorization - Module')
@Controller('authorization')
export class AuthorizationController {
  constructor(private authorizationService: AuthorizationService) {}

  @Post('assign-permission')
  @ApiOperation({
    summary: 'Assign Permissions to Role',
    description:
      'Assigns a set of permissions to a specified role within a domain.',
  })
  async assignPermission(@Body() dto: AssignPermissionDto) {
    await this.authorizationService.assignPermission(
      new RoleAssignPermissionCommand(dto.domain, dto.roleId, dto.permissions),
    );
  }
}
