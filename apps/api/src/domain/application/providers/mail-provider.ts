export abstract class MailProvider {
  abstract sendEmail(props: {
    to: string
    subject: string
    body: string
  }): Promise<void>
}
