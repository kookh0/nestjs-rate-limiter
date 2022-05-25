import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { RateLimiterModule, RateLimiterGuard } from 'nestjs-rate-limiter';

@Module({
  imports: [
    //10초(duration) 동안 3번(points)을 초과해서 호출하면 429 상태코드 반환, 10초가 지나면 리셋되어서 다시 요청이 가능해짐
    //duration 과 points 는 상황에 맞게 적절히 장성
    RateLimiterModule.register({
      keyPrefix: 'test',
      points: 3,
      duration: 10,
      customResponseSchema: () => {
        return { statusCode: '429', message: 'Request has been blocked' };
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RateLimiterGuard,
    },
  ],
})
export class AppModule {}
