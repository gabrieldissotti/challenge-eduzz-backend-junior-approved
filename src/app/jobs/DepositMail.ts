import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class DepositMail {
  get key (): string {
    return 'DepositMail';
  }

  async handle ({ data }): Promise<void> {
    const { transaction, user } = data;

    await Mail.sendMail({
      to: `${user.name} <${user.email}>`,
      subject: 'Depósito realizado',
      template: 'deposit',
      context: {
        user,
        transaction,
        date: format(
          parseISO(transaction.date),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
    console.log(`sent deposit email to ${user.email}`)
  }
}

export default new DepositMail();
