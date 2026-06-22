import { Injectable, BadRequestException, UnauthorizedException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async onModuleInit(): Promise<void> {
    const adminEmail = 'admin@burrito.com';
    const adminExists = await this.userRepository.findOneBy({ email: adminEmail });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await this.userRepository.save(
        this.userRepository.create({
          nombre: 'Administrador',
          email: adminEmail,
          password: hashedPassword,
          rol: 'admin',
        }),
      );
    }
  }

  async register(registerDto: RegisterDto) {
    const { email, password, nombre } = registerDto;
    const userExists = await this.userRepository.findOneBy({ email });
    
    if (userExists) throw new BadRequestException('El correo ya existe');

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({ nombre, email, password: hashedPassword });
    
    await this.userRepository.save(newUser);
    return { message: 'Usuario registrado' };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOneBy({ email });
    
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Credenciales inválidas');

    const payload = { email: user.email, sub: user.id, rol: user.rol };
    return {
      access_token: await this.jwtService.signAsync(payload),
      rol: user.rol,
      id: user.id,
      nombre: user.nombre,
    };
  }
}
