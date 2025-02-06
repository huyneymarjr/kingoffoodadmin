import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('promotions')
@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Post()
  create(@Body() createPromotionDto: CreatePromotionDto, @User() user: IUser) {
    return this.promotionsService.create(createPromotionDto, user);
  }

  @Post('check-promotion')
  @Public()
  @ResponseMessage('Check Promotion')
  @ApiBody({
    schema: { type: 'object', properties: { name: { type: 'string' } } },
  })
  checkPromotion(@Body() body: { name: string }) {
    return this.promotionsService.checkPromotion(body.name);
  }

  @Get()
  @Public()
  @ResponseMessage('Fetch List Promotion with paginate')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.promotionsService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.promotionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePromotionDto: UpdatePromotionDto,
    @User() user: IUser,
  ) {
    return this.promotionsService.update(id, updatePromotionDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.promotionsService.remove(id, user);
  }
}
