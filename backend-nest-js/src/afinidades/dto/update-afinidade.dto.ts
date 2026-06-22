import { PartialType } from '@nestjs/mapped-types';
import { CreateAfinidadeDto } from './create-afinidade.dto';

export class UpdateAfinidadeDto extends PartialType(CreateAfinidadeDto) {}
