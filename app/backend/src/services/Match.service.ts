import MatchDTO from '../dtos/MatchDTO';
// import createError from '../utils/createError';
import Match from '../database/models/Match';
import Team from '../database/models/Team';
import createError from '../utils/createError';

const filteredQuery = async (inProgress: boolean) => {
  const matches = await Match.findAll({
    attributes: { exclude: ['home_team', 'away_team'] },
    include: [{
      attributes: { exclude: ['id'] },
      model: Team,
      as: 'teamHome',
    },
    {
      attributes: { exclude: ['id'] },
      model: Team,
      as: 'teamAway',
    }],
    where: { inProgress },
  });
  return matches;
};

const unfilteredQuery = async () => {
  const matches = await Match.findAll({
    attributes: { exclude: ['home_team', 'away_team'] },
    include: [{
      attributes: { exclude: ['id'] },
      model: Team,
      as: 'teamHome',
    },
    {
      attributes: { exclude: ['id'] },
      model: Team,
      as: 'teamAway',
    }],
  });
  return matches;
};

export default class MatchService {
  static async getAll(inProgress: boolean | undefined): Promise<MatchDTO[]> {
    if (inProgress !== undefined) {
      const matches = await filteredQuery(inProgress);
      return matches;
    }
    const matches = await unfilteredQuery();
    return matches;
  }

  static async create(body: MatchDTO): Promise<MatchDTO> {
    const { homeTeam, awayTeam } = body;

    if (homeTeam === awayTeam) {
      throw createError(422, 'It is not possible to create a match with two equal teams');
    }

    const ht = await Team.findByPk(homeTeam);
    const at = await Team.findByPk(awayTeam);

    if (!ht || !at) throw createError(404, 'There is no team with such id!');

    const createdMatch = await Match.create({ ...body, inProgress: true });
    return createdMatch;
  }

  static async update(id: number, body: MatchDTO): Promise<void> {
    await Match.update({ ...body }, { where: { id } });
  }

  static async finish(id: number): Promise<void> {
    await Match.update({ inProgress: false }, { where: { id } });
  }

  // static async getById(id: number): Promise<TeamDTO> {
  //   const team = await Team.findByPk(id);
  //   if (team) return team.toJSON();
  //   throw createError(404, 'Team not found');
  // }
}
