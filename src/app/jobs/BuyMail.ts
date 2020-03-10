import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class BuyMail {
  get key (): string {
    return 'BuyMail';
  }

  async handle ({ data }): Promise<void> {
    const { transaction, user } = data;

    await Mail.sendMail({
      to: `${user.name} <${user.email}>`,
      subject: 'Compra realizada',
      template: 'buy',
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
  }
}

export default new BuyMail();
