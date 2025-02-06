import { Injectable } from '@nestjs/common';
import { ModulesContainer, Reflector } from '@nestjs/core';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
@Injectable()
export class AppService {
  constructor(
    private readonly modulesContainer: ModulesContainer,
    private readonly reflector: Reflector,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async getAllModules() {
    const collections = await this.connection.db.listCollections().toArray();
    return collections.reduce((acc, collection) => {
      const name = collection.name;
      return {
        ...acc,
        [name.toUpperCase()]: name.toUpperCase(),
      };
    }, {});
  }
  getHello(): string {
    //model : code
    return 'Hello Huy Neymar';
  }
}
