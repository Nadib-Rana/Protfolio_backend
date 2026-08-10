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
    const adminCount = await this.prisma.adminUser.count();
    if (adminCount === 0) {
      const defaultPassword = await bcrypt.hash("admin123", 10);
      await this.prisma.adminUser.create({
        data: {
          username: "admin",
          email: "admin@example.com",
          password: defaultPassword,
          role: "SUPER_ADMIN",
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
