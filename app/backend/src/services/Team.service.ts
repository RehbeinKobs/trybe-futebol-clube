import TeamDTO from '../dtos/TeamDTO';
import createError from '../utils/createError';
import Team from '../database/models/Team';

export default class TeamService {
  static async getAll(): Promise<TeamDTO[]> {
    const teams = await Team.findAll();
    return teams;
  }

  static async getById(id: number): Promise<TeamDTO> {
    const team = await Team.findByPk(id);
    if (team) return team.toJSON();
    throw createError(404, 'Team not found');
  }
}
