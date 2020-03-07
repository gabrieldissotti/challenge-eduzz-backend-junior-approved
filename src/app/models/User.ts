import Sequelize from 'sequelize';
import { Model } from 'sequelize-typescript';

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
 *       password:
 *         type: string
 *       created_at:
 *         type: string
 *       updated_at:
 *         type: string
 */
class User extends Model {
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

    return this;
  }

  static associate (models): void {
    this.hasMany(models.Transaction, {
      foreignKey: 'user_id',
      as: 'transactions',
    });
  }
}

export default User;
