import { Model, INTEGER, STRING } from 'sequelize';
import db from '.';

class User extends Model {
  id!: number;
  name!: string;
  displayName!: string;
  password!: string;
  image!: string;
}

User.init({
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  username: { type: STRING },
  email: { type: STRING, unique: true },
  password: { type: STRING },
  role: { type: STRING },
}, {
  sequelize: db,
  tableName: 'users',
  timestamps: false,
  underscored: true,
});

export default User;
