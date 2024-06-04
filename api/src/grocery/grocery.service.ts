import { Injectable } from '@nestjs/common'

import { PrismaService } from 'src/prisma/prisma.service'
import { FilterGroceryDto } from './dto/filter.dto'
import { CreateGroceryDto, UpdateGroceryDto } from './dto/grocery.dto'

@Injectable()
export class GroceryService {
  constructor(private readonly prisma: PrismaService) {}

  async filterGroceries(filter: FilterGroceryDto) {
    /**
     * @todo add pagination
     */
    const groceries = await this.prisma.groceryItem.findMany({
      where: filter,
      orderBy: [{ priority: 'asc' }, { name: 'asc' }],
    })

    return groceries
  }

  async createGrocery(createGroceryDto: CreateGroceryDto) {
    return this.prisma.groceryItem.create({ data: createGroceryDto })
  }

  async updateGrocery(id: string, updateGroceryDto: UpdateGroceryDto) {
    return this.prisma.groceryItem.update({
      where: { id },
      data: updateGroceryDto,
    })
  }
}
