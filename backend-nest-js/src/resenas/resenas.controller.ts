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
import { ResenasService } from './resenas.service';
import { CreateResenaDto } from './dto/create-resena.dto';
import { UpdateResenaDto } from './dto/update-resena.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Reseñas')
@Controller('resenas')
export class ResenasController {
  constructor(private readonly resenasService: ResenasService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una reseña para un libro' })
  create(
    @Body() createResenaDto: CreateResenaDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.resenasService.create(createResenaDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las reseñas' })
  findAll() {
    return this.resenasService.findAll();
  }

  @Get('mis-resenas')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener las reseñas del usuario autenticado' })
  findMine(@CurrentUser() user: { id: number }) {
    return this.resenasService.findByUsuario(user.id);
  }

  @Get('libro/:libroId')
  @ApiOperation({ summary: 'Obtener reseñas de un libro' })
  findByLibro(@Param('libroId', ParseIntPipe) libroId: number) {
    return this.resenasService.findByLibro(libroId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una reseña por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.resenasService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar una reseña propia' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateResenaDto: UpdateResenaDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.resenasService.update(id, updateResenaDto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una reseña propia' })
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.resenasService.remove(id, user.id);
  }
}
