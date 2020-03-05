require('dotenv/config')

module.exports = {
  dialect: 'mysql',
  host: process.env.MARIADB_HOST,
  port: process.env.MARIADB_PORT,
  username: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASS,
  database:
    process.env.NODE_ENV === 'test'
      ? `${process.env.MARIADB_NAME}_test`
      : process.env.MARIADB_NAME,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
    updatedAt: 'created_at',
    createdAt: 'updated_at'
  }
}
