import Sequelize from 'sequelize';
import { Model } from 'sequelize-typescript';
import bcrypt from 'bcryptjs';

/**
 * @swagger
 *
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       name:
 *         type: string
 *       email:
 *         type: string
 *   Session:
 *     type: object
 *     properties:
 *       user:
 *         $ref: '#/definitions/User'
 *       token:
 *         type: string
 */
class User extends Model {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
  created_at?: string;
  updated_at?: string;

  static init (sequelize): any {
    super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async (user: any) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate (models): void {
    this.hasMany(models.Transaction, {
      foreignKey: 'user_id',
      as: 'transactions',
    });
  }

  checkPassword (password): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

export default User;
