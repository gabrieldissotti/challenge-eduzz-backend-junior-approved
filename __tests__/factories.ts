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
  amount: 25,
  currency_type: 'BRL',
})

export default factory
