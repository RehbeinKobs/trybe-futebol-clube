import * as bcrypt from 'bcryptjs';
import UserDTO from '../dtos/UserDTO';
import createError from '../utils/createError';
import User from '../database/models/User';

export default class UserService {
  static async getAll(): Promise<UserDTO[]> {
    const users = await User.findAll();
    return users;
  }

  static async getById(id: number): Promise<UserDTO> {
    const user = await User.findOne({ where: { id } });
    if (user) return user.toJSON() as UserDTO;
    throw createError(404, 'User not found');
  }

  static async login(body: UserDTO): Promise<number> {
    const { email, password } = body;
    if (!email || !password) throw createError(400, 'All fields must be filled');
    const user = await User.findOne({
      attributes: ['id', 'password'],
      where: { email },
    });
    if (user) {
      const { id, password: dbPassword } = user.toJSON() as UserDTO;
      const correct = bcrypt.compareSync(password, dbPassword);
      if (correct) return id as number;
    }
    throw createError(401, 'Incorrect email or password');
  }
}
