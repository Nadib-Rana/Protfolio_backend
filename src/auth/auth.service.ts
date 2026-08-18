import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma.service";
import * as bcrypt from "bcryptjs";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
    const defaultPassword = await bcrypt.hash("NADIBRANA", 10);
    const existingAdmin = await this.prisma.adminUser.findFirst({
      where: {
        OR: [
          { username: "admin" },
          { email: "nadibsoft@gmail.com" },
          { email: "admin@example.com" },
        ],
      },
    });

    if (!existingAdmin) {
      await this.prisma.adminUser.create({
        data: {
          username: "admin",
          email: "nadibsoft@gmail.com",
          password: defaultPassword,
          role: "SUPER_ADMIN",
        },
      });
    } else {
      await this.prisma.adminUser.update({
        where: { id: existingAdmin.id },
        data: {
          email: "nadibsoft@gmail.com",
          password: defaultPassword,
        },
      });
    }
  }

  async login(dto: LoginDto) {
    const usernameOrEmail = dto.username || dto.email;
    if (!usernameOrEmail) {
      throw new UnauthorizedException("Username or email is required");
    }

    const admin = await this.prisma.adminUser.findFirst({
      where: {
        OR: [
          { username: usernameOrEmail },
          { email: usernameOrEmail },
        ],
      },
    });

    if (!admin) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(dto.password, admin.password);
    if (!isMatch) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = {
      sub: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    };
  }

  async getProfile(adminId: string) {
    const admin = await this.prisma.adminUser.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    return admin;
  }
}
