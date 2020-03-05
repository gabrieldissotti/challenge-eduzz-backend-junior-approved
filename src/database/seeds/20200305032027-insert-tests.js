'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('tests', [
      {},
      {},
      {}
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tests', null, {})
  }
}
