import { Module } from '@nestjs/common';
import { ProxyService } from './service/proxy.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    HttpModule.register({
      timeout: 5000, // 5 seconds
      maxRedirects: 5,
    }),
  ],
  providers: [ProxyService],
  exports: [ProxyService],
})
export class ProxyModule {}
