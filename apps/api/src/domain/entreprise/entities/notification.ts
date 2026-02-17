import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface NotificationProps {
  title: string
  content: string
  destination: {
    sendIds: {
      userId: string
      readAt?: Date
    }[]
  }
  createdAt: Date
  updatedAt?: Date
}

export class Notification extends Entity<NotificationProps> {
  get title() {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title
    this.update()
  }

  get content() {
    return this.props.content
  }

  set content(content: string) {
    this.props.content = content
    this.update()
  }

  get sendIds() {
    return this.props.destination.sendIds
  }

  get destination() {
    return this.props.destination
  }

  set destination(destination: NotificationProps['destination']) {
    this.props.destination = destination
    this.update()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private update() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<NotificationProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID,
  ): Notification {
    const notification = new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    )

    return notification
  }
}
