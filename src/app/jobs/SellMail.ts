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
          parseISO(transactions?.credited[0]?.date || new Date()),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
    console.log(`sent sell email to ${user.email}`)
  }
}

export default new SellMail();
