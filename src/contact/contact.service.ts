import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CreateContactMessageDto } from "./dto/create-contact-message.dto";

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(dto: CreateContactMessageDto) {
    return this.prisma.contactMessage.create({
      data: dto,
    });
  }

  async getAllMessages() {
    return this.prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async markAsRead(id: string) {
    const msg = await this.prisma.contactMessage.findUnique({ where: { id } });
    if (!msg) throw new NotFoundException("Message not found");

    return this.prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async deleteMessage(id: string) {
    const msg = await this.prisma.contactMessage.findUnique({ where: { id } });
    if (!msg) throw new NotFoundException("Message not found");

    return this.prisma.contactMessage.delete({ where: { id } });
  }
}
