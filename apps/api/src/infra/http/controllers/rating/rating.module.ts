import { Module } from '@nestjs/common'
import { CreateRatingUseCase } from '@/domain/application/use-cases/rating/create-rating-use-case'
import { GetUserRatingUseCase } from '@/domain/application/use-cases/rating/get-user-rating-use-case'
import { CreateRatingController } from './create-rating.controller'
import { GetUserRatingController } from './get-user-rating.controller'

@Module({
  controllers: [CreateRatingController, GetUserRatingController],
  providers: [CreateRatingUseCase, GetUserRatingUseCase],
})
export class RatingModule {}
