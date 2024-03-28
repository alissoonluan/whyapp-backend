import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { PrismaService } from 'src/database/prisma.service';
import { Grupo } from '@prisma/client';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AddMembersDto } from './dto/add-members.dto';
// import { UpdateGroupDto } from './dto/update-group.dto';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const groupIncludedData = {
  usuarios: true,
  cargos: true,
  mensagens: true,
  imagens: true,
  audio: true,
  videos: true,
  documentos: true,
  enquetes: true,
  _count: true,
};

@Injectable()
export class GroupsService {
  constructor(private prismaService: PrismaService) {}
  async create(createGroupDto: CreateGroupDto): Promise<Error | Grupo> {
    const { nome, descricao, foto, token, proprietarioId } = createGroupDto;
    try {
      const grupo = await this.prismaService.grupo.create({
        data: {
          nome,
          proprietarioId,
          descricao,
          foto,
          token,
          usuarios: {
            create: {
              adicionadoPor: proprietarioId,
              usuarioId: proprietarioId,
            },
          },
        },
        include: groupIncludedData,
      });
      return grupo;
    } catch (error) {
      console.log(error);
      return new Error('Erro ao criar grupo');
    }
  }

  async update(
    updateGroupDto: UpdateGroupDto,
    groupId: string,
  ): Promise<Error | Grupo> {
    try {
      const groupNewData = await this.prismaService.grupo.update({
        where: {
          id: groupId,
        },
        data: updateGroupDto,
        include: groupIncludedData,
      });
      return groupNewData;
    } catch (error) {
      console.log(error);
      return new Error('Um erro ocurreu ao atualizar os dados do grupo');
    }
  }

  async getById(id: string): Promise<Error | Grupo> {
    try {
      const grupo = await this.prismaService.grupo.findUnique({
        where: { id },
        include: groupIncludedData,
      });
      return grupo;
    } catch (error) {
      console.log(error);
      return new Error('Erro ao buscar grupo pelo id');
    }
  }

  async deleteById(groupId: string): Promise<Error | Grupo> {
    try {
      const deletedGroup = await this.prismaService.grupo.delete({
        where: { id: groupId },
        include: groupIncludedData,
      });
      return deletedGroup;
    } catch (error) {
      console.log(error);
      return new Error('Erro ao remover grupo pelo id');
    }
  }

  async getAllByUserId(userId: string): Promise<Error | Grupo[]> {
    try {
      const grupos = await this.prismaService.grupo.findMany({
        where: { usuarios: { some: { usuarioId: userId } } },
        include: groupIncludedData,
      });
      return grupos;
    } catch (error) {
      console.log(error);
      return new Error('Erro ao procurar por grupos deste usuário');
    }
  }

  async addMembers(membros: Array<AddMembersDto>, groupId: string) {
    try {
      const grupo = await this.prismaService.grupo.update({
        where: { id: groupId },
        data: {
          usuarios: {
            createMany: {
              skipDuplicates: true,
              data: membros,
            },
          },
        },
      });
      return grupo;
    } catch (error) {
      console.log(error);
      return new Error('Erro ao adicionar membro ao grupo');
    }
  }

  async removeMembers(membros: Array<AddMembersDto>, groupId: string) {
    try {
      const grupo = await this.prismaService.grupo.update({
        where: { id: groupId },
        data: {
          usuarios: {
            deleteMany: membros,
          },
        },
      });
      return grupo;
    } catch (error) {
      console.log(error);
      return new Error('Erro ao adicionar membro ao grupo');
    }
  }

  private async getGroupMembers(groupId: string) {
    const membros = await this.prismaService.grupo.findFirst({
      where: { id: groupId },
      select: { usuarios: true },
    });
    return membros.usuarios;
  }

  // async isGroupMember(
  //   groupId: string,
  //   membros: string[],
  // ): Promise<boolean | Error> {
  //   let isMembro = true;
  //   try {
  //     membros.forEach(async (membroId) => {
  //       const foundMembro = await this.prismaService.grupo.findFirst({
  //         where: {
  //           AND: {
  //             id: groupId,
  //             usuarios: {
  //               has: membroId,
  //             },
  //           },
  //         },
  //       });
  //       if (!foundMembro) {
  //         console.log('false', isMembro);
  //         isMembro = false;
  //       }
  //       console.log('true', isMembro);
  //       isMembro = true;
  //     });
  //     return isMembro;
  //   } catch (error) {
  //     console.log(error);
  //     return new Error('Erro ao buscar membro do grupo');
  //   }
  // }
}
