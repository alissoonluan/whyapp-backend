/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateGroupMessageDto } from './dto/create-group-message.dto';
import { UpdateGroupMessageDto } from './dto/update-group-message.dto';
import { PrismaService } from 'src/database/prisma.service';
import { GrupoMessage } from '@prisma/client';

const grupoMessageIncludedData = {};
@Injectable()
export class GroupMessagesService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(
    createGroupMessageDto: CreateGroupMessageDto,
  ): Promise<Error | GrupoMessage> {
    try {
      const message = await this.prismaService.grupoMessage.create({
        data: createGroupMessageDto,
        include: grupoMessageIncludedData,
      });
      return message;
    } catch (error) {
      console.log(error);
      return new Error('Erro ao cadastrar mensagem');
    }
  }

  async deleteById(id: string): Promise<Error | GrupoMessage> {
    try {
      const oldMessage = await this.prismaService.grupoMessage.delete({
        where: { id },
        include: grupoMessageIncludedData,
      });
      return oldMessage;
    } catch (error) {
      console.log(error);
      return new Error('Erro ao remover a mensagem do grupo');
    }
  }

  async updateById(
    id: string,
    mensagem: string,
  ): Promise<Error | GrupoMessage> {
    try {
      const editedMessage = await this.prismaService.grupoMessage.update({
        where: { id },
        data: {
          mensagem,
        },
        include: grupoMessageIncludedData,
      });
      return editedMessage;
    } catch (error) {
      console.log(error);
      return new Error('Erro ao atualizar mensagem');
    }
  }
}
