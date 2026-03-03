import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface RecipientInfo {
  userId: string
  readAt?: Date
}

export interface NotificationProps {
  title: string
  content: string
  destination: {
    sendIds: RecipientInfo[]
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
    this.touch()
  }

  get content() {
    return this.props.content
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  get sendIds(): ReadonlyArray<RecipientInfo> {
    return [...this.props.destination.sendIds]
  }

  get destination() {
    return {
      sendIds: [...this.props.destination.sendIds],
    }
  }

  set destination(destination: NotificationProps['destination']) {
    this.props.destination = destination
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  isRecipient(userId: string): boolean {
    return this.props.destination.sendIds.some((r) => r.userId === userId)
  }

  markAsReadForUser(userId: string): boolean {
    const recipient = this.props.destination.sendIds.find(
      (r) => r.userId === userId
    )

    if (!recipient || recipient.readAt) return false

    recipient.readAt = new Date()
    this.touch()
    return true
  }

  removeRecipient(userId: string): void {
    this.props.destination.sendIds = this.props.destination.sendIds.filter(
      (r) => r.userId !== userId
    )
    this.touch()
  }

  getRecipientReadAt(userId: string): Date | undefined {
    return this.props.destination.sendIds.find((r) => r.userId === userId)
      ?.readAt
  }

  get recipientCount(): number {
    return this.props.destination.sendIds.length
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<NotificationProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID
  ): Notification {
    const notification = new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id
    )

    return notification
  }
}
