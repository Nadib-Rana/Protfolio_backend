import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common";
import { ContactService } from "./contact.service";
import { CreateContactMessageDto } from "./dto/create-contact-message.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("contact")
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async submitMessage(@Body() dto: CreateContactMessageDto) {
    return this.contactService.createMessage(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getInboxMessages() {
    return this.contactService.getAllMessages();
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id/read")
  async markMessageRead(@Param("id") id: string) {
    return this.contactService.markAsRead(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async deleteMessage(@Param("id") id: string) {
    return this.contactService.deleteMessage(id);
  }
}
