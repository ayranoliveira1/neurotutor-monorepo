import { MailProvider } from '@/domain/application/providers/mail-provider'

export class FakeMailProvider implements MailProvider {
  public emailsSent: Array<{ to: string; subject: string; body: string }> = []

  async sendEmail(props: {
    to: string
    subject: string
    body: string
  }): Promise<void> {
    this.emailsSent.push(props)
  }
}
