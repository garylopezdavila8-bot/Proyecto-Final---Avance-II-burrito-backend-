import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AfinidadesService } from './afinidades.service';
import { CreateAfinidadeDto } from './dto/create-afinidade.dto';
import { UpdateAfinidadeDto } from './dto/update-afinidade.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Afinidades')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('afinidades')
export class AfinidadesController {
  constructor(private readonly afinidadesService: AfinidadesService) {}

  @Post()
  @ApiOperation({ summary: 'Las afinidades se calculan automáticamente' })
  create(@Body() createAfinidadeDto: CreateAfinidadeDto) {
    return this.afinidadesService.create();
  }

  @Get()
  @ApiOperation({ summary: 'Obtener usuarios altamente afines al usuario autenticado' })
  findAll(@CurrentUser() user: { id: number }) {
    return this.afinidadesService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener afinidad con un usuario específico' })
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.afinidadesService.findOne(user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Las afinidades no pueden modificarse manualmente' })
  update(@Param('id') id: string, @Body() updateAfinidadeDto: UpdateAfinidadeDto) {
    return this.afinidadesService.update();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Las afinidades no pueden eliminarse manualmente' })
  remove(@Param('id') id: string) {
    return this.afinidadesService.remove();
  }
}
