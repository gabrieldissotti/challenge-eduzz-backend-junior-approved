import faker from 'faker';
import { factory } from 'factory-girl';

import User from '../src/app/models/User';
import Transaction from '../src/app/models/Transaction';

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})

factory.define('Transaction', Transaction, {
  user_id: 1,
  type: 'credit',
  amount: 9999,
  currency_type: 'BRL',
})

factory.define('TransactionBTC', Transaction, {
  amount: 999,
  user_id: 1,
  type: 'purchase',
  currencyType: 'BTC',
})

export default factory
