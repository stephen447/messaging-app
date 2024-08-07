'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      models.User.hasMany(Message, { foreignKey: 'fromUserId', as: 'sentMessages' });
      models.User.hasMany(Message, { foreignKey: 'toUserId', as: 'receivedMessages' });
      Message.belongsTo(models.User, { foreignKey: 'fromUserId', as: 'fromUser' });
      Message.belongsTo(models.User, { foreignKey: 'toUserId', as: 'toUser' });
    }
  }

  Message.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fromUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Adjust the model name if necessary
        key: 'id',
      },
    },
    toUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Adjust the model name if necessary
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'Message',
  });

  return Message;
};
