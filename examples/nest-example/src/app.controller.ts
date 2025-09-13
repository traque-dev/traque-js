import { Controller, Get, NotFoundException } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    throw new NotFoundException('Hello, Traque!');
  }
}
