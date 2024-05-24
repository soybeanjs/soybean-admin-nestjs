import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Public } from '@src/infra/decorators/public.decorator';
import { MenuService } from '@src/lib/bounded-contexts/iam/menu/application/service/menu.service';

@ApiTags('Menu - Module')
@Controller('route')
export class MenuController {
  constructor(
    private queryBus: QueryBus,
    private menuService: MenuService,
  ) {}

  @Public()
  @Get('getConstantRoutes')
  @ApiOperation({
    summary: 'Get constant routes',
    description: 'Retrieve all constant routes available in the system.',
  })
  async getConstantRoutes() {
    return this.menuService.getConstantRoutes();
  }
}
