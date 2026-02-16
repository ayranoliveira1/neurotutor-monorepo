import { Global, Module } from '@nestjs/common'
import { BcryptHasher } from './bcrypt-hasher'
import { HashGenerator } from '@/domain/application/cryptography/hash-generator'
import { HashComparer } from '@/domain/application/cryptography/hash-comparer'

@Global()
@Module({
  providers: [
    { provide: HashGenerator, useClass: BcryptHasher },
    { provide: HashComparer, useClass: BcryptHasher },
  ],
  exports: [HashGenerator, HashComparer],
})
export class CryptographyModule {}
