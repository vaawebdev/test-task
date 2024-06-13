import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { FilterGroceryDto } from './dto/filter.dto'
import { CreateGroceryDto, GroceryItemIdDto, UpdateGroceryDto } from './dto/grocery.dto'
import { GroceryService } from './grocery.service'

@Controller({
  version: '1',
  path: 'grocery',
})
export class GroceryController {
  constructor(private readonly groceryService: GroceryService) {}

  @Get()
  async filterGroceries(@Query() filter: FilterGroceryDto) {
    const data = await this.groceryService.filterGroceries(filter)

    return {
      data,
    }
  }

  @Post()
  async createGrocery(@Body() createGroceryDto: CreateGroceryDto) {
    const data = await this.groceryService.createGrocery(createGroceryDto)

    return {
      data,
    }
  }

  @Patch(':id')
  async updateGrocery(@Param() { id }: GroceryItemIdDto, @Body() updateGroceryDto: UpdateGroceryDto) {
    const data = await this.groceryService.updateGrocery(id, updateGroceryDto)

    return {
      data,
    }
  }

  @Delete(':id')
  async deleteGrocery(@Param() { id }: GroceryItemIdDto) {
    await this.groceryService.deleteGrocery(id)
  }
}
