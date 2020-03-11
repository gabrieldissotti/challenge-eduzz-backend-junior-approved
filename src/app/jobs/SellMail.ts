import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class SellMail {
  get key (): string {
    return 'SellMail';
  }

  async handle ({ data }): Promise<void> {
    const { transactions, user } = data;

    await Mail.sendMail({
      to: `${user.name} <${user.email}>`,
      subject: 'Venda realizada',
      template: 'sell',
      context: {
        user,
        transactions,
        date: format(
          parseISO(transactions.credited[0].date),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new SellMail();
