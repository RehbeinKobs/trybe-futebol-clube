'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('matches', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      home_team: {
        type: Sequelize.INTEGER,
        references: {
          model: 'teams',
          key: 'id',
        },
      },
      home_team_goals: { type: Sequelize.INTEGER },
      away_team: {
        type: Sequelize.INTEGER,
        references: {
          model: 'teams',
          key: 'id',
        },
      },
      away_team_goals: { type: Sequelize.INTEGER },
      in_progress: { type: Sequelize.INTEGER },
    }, {
      freezeTableNames: true,
      timestamps: false,
    });
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.drop();
  }
};
