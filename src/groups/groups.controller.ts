import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Query,
  Put,
  Get,
  Delete,
} from '@nestjs/common';
import { Response } from 'express';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { StatusCodes } from 'http-status-codes';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { UpdateGroupDto } from './dto/update-group.dto';
// import { UpdateGroupDto } from './dto/update-group.dto';

@UseGuards(AuthGuard)
@ApiTags('Group')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  async create(@Body() createGroupDto: CreateGroupDto, @Res() res: Response) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { nome, proprietarioId, usuarios, descricao, foto, token } =
      createGroupDto;
    if (!nome)
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'É preciso enviar um nome e o proprietarioId',
        status: 400,
      });
    const userGrupos = await this.groupsService.create(createGroupDto);
    if (userGrupos instanceof Error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: userGrupos.message,
        status: 500,
      });
    return res.status(StatusCodes.CREATED).json({
      message: 'Grupo criado com sucesso',
      status: 200,
      data: userGrupos,
    });
  }

  @Put()
  async updateById(
    @Body() updateGroupDto: UpdateGroupDto,
    @Query('groupId') groupId: string,
    @Res() res: Response,
  ) {
    if (!groupId)
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Você deve fornecer groupId nas queries',
        status: 400,
      });
    const groupExists = await this.groupsService.getById(groupId);
    console.log(groupExists);
    if (groupExists instanceof Error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errorMessage: groupExists.message,
        status: 500,
      });
    if (!groupExists)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Esse grupo não existe',
        status: 500,
      });
    const groupNewData = await this.groupsService.update(
      updateGroupDto,
      groupId,
    );
    if (groupNewData instanceof Error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: groupNewData.message,
        status: 500,
      });
    return res.status(StatusCodes.OK).json({
      message: 'Dados do grupo atualizados com sucesso',
      status: 200,
      groupNewData,
    });
  }

  @Get()
  async getById(@Query('groupId') groupId: string, @Res() res: Response) {
    if (!groupId)
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Você deve fornecer groupId nas queries',
        status: 400,
      });
    const groupExists = await this.groupsService.getById(groupId);
    console.log(groupExists);
    if (groupExists instanceof Error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errorMessage: groupExists.message,
        status: 500,
      });
    if (!groupExists)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Esse grupo não existe',
        status: 500,
      });
    const grupo = await this.groupsService.getById(groupId);
    if (grupo instanceof Error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: grupo.message,
        status: 500,
      });
    return res.status(StatusCodes.OK).json({
      message: 'Grupo encontrado com sucesso',
      status: 200,
      grupo,
    });
  }

  @Delete()
  async deleteById(@Query('groupId') groupId: string, @Res() res: Response) {
    if (!groupId)
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Você deve fornecer groupId nas queries',
        status: 400,
      });
    const groupExists = await this.groupsService.getById(groupId);
    console.log(groupExists);
    if (groupExists instanceof Error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errorMessage: groupExists.message,
        status: 500,
      });
    if (!groupExists)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Esse grupo não existe',
        status: 500,
      });
    const grupoAntigo = await this.groupsService.deleteById(groupId);
    if (grupoAntigo instanceof Error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: grupoAntigo.message,
        status: 500,
      });
    return res.status(StatusCodes.OK).json({
      message: 'Grupo removido com sucesso',
      status: 200,
      grupoAntigo,
    });
  }

  @Get('/user-groups')
  async getAllByUserid(@Query('userId') userId: string, @Res() res: Response) {
    if (!userId)
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Você deve fornecer userId nas queries',
        status: 400,
      });
    const grupos = await this.groupsService.getAllByUserId(userId);
    if (grupos instanceof Error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: grupos.message,
        status: 500,
      });
    return res.status(StatusCodes.OK).json({
      message: 'Grupos encontrados com sucesso',
      status: 200,
      grupos,
    });
  }
}
