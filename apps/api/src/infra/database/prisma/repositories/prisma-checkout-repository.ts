import { CheckoutRepository } from '@/domain/application/repositories/checkout-repository'
import { Checkout } from '@/domain/entreprise/entities/checkout'
import { CheckoutMapper } from '../mappers/prisma-checkout-mapper'
import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaCheckoutRepository implements CheckoutRepository {
  constructor(private prisma: PrismaService) {}

  async createCheckout(checkout: Checkout): Promise<void> {
    const data = CheckoutMapper.toPrisma(checkout)
    await this.prisma.checkout.create({
      data,
    })
  }

  async updateCheckout(checkout: Checkout): Promise<void> {
    const data = CheckoutMapper.toPrisma(checkout)
    await this.prisma.checkout.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async findByCheckoutSession(
    checkoutSession: string
  ): Promise<Checkout | null> {
    const checkout = await this.prisma.checkout.findFirst({
      where: {
        checkoutSession,
      },
    })

    if (!checkout) {
      return null
    }

    return CheckoutMapper.toDomain(checkout)
  }
}
