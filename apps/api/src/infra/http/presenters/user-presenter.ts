import { User } from '@/domain/entreprise/entities/user'

export class UserPresenter {
  static toHTTP(user: User) {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      cpfCnpj: user.cpfCnpj,
      phone: user.phone,
      address: user.address,
      addressNumber: user.addressNumber,
      province: user.province,
      postalCode: user.postalCode,
      image: user.image,
      role: user.role,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
