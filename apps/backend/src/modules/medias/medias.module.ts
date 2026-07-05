import { Module } from '@nestjs/common';
import { MediasController } from './medias.controller';
import { MediasService } from './medias.service';
import { StorageService } from './storage.service';

@Module({
  controllers: [MediasController],
  providers: [MediasService, StorageService],
  exports: [MediasService, StorageService],
})
export class MediasModule {}
