import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Role } from '@/core/enums/enums'
import { Optional } from '@/core/types/optional'

export interface UserProps {
  name: string
  email: string
  cpfCnpj?: string
  phone?: string
  address?: string
  addressNumber?: string
  province?: string
  postalCode?: string
  emailVerified: boolean
  image: string | null
  role: Role | null
  createdAt: Date
  updatedAt: Date
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get email() {
    return this.props.email
  }

  set email(email: string) {
    this.props.email = email
    this.touch()
  }

  get emailVerified() {
    return this.props.emailVerified
  }

  set emailVerified(verified: boolean) {
    this.props.emailVerified = verified
    this.touch()
  }

  get cpfCnpj() {
    return this.props.cpfCnpj
  }

  set cpfCnpj(value: string | undefined) {
    this.props.cpfCnpj = value
    this.touch()
  }

  get phone() {
    return this.props.phone
  }

  set phone(phone: string | undefined) {
    this.props.phone = phone
    this.touch()
  }

  get address() {
    return this.props.address
  }

  set address(address: string | undefined) {
    this.props.address = address
    this.touch()
  }

  get addressNumber() {
    return this.props.addressNumber
  }

  set addressNumber(addressNumber: string | undefined) {
    this.props.addressNumber = addressNumber
    this.touch()
  }

  get province() {
    return this.props.province
  }

  set province(province: string | undefined) {
    this.props.province = province
    this.touch()
  }

  get postalCode() {
    return this.props.postalCode
  }

  set postalCode(postalCode: string | undefined) {
    this.props.postalCode = postalCode
    this.touch()
  }

  get image() {
    return this.props.image
  }

  set image(image: string | null) {
    this.props.image = image
    this.touch()
  }

  get role() {
    return this.props.role
  }

  set role(role: Role | null) {
    this.props.role = role
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<
      UserProps,
      'createdAt' | 'updatedAt' | 'emailVerified' | 'image' | 'role'
    >,
    id?: UniqueEntityID
  ) {
    const user = new User(
      {
        ...props,
        emailVerified: props.emailVerified ?? false,
        image: props.image ?? null,
        role: props.role ?? null,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id
    )

    return user
  }
}
