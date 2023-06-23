import { Module } from '@nestjs/common';

import { DirectorResolver } from './director.resolver';

@Module({ providers: [DirectorResolver] })
export class DirectorModule {}
