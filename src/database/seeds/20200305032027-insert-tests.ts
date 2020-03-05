'use strict';

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert('tests', [{}, {}, {}]);
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('tests', null, {});
  },
};
