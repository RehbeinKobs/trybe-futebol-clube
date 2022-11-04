import LeaderboardDTO from '../dtos/LeaderboardDTO';
import MatchService from './Match.service';
import Team from '../database/models/Team';
import MatchDTO from '../dtos/MatchDTO';

const defaultLb = {
  totalPoints: 0,
  totalGames: 0,
  totalVictories: 0,
  totalDraws: 0,
  totalLosses: 0,
  goalsFavor: 0,
  goalsOwn: 0,
  goalsBalance: 0,
  efficiency: 0,
};

const assignLBValues = (lb: LeaderboardDTO, id: number, match: MatchDTO) => {
  const { homeTeam, homeTeamGoals, awayTeamGoals } = match;

  const ht = homeTeam as number;
  const htg = homeTeamGoals as number;
  const atg = awayTeamGoals as number;
  const lbTemp = lb;

  const home = ht === id;
  const victory = Number((htg > atg) && home) + Number((atg > htg) && !home);
  const defeat = Number((htg > atg) && !home) + Number((atg > htg) && home);

  lbTemp.totalPoints += victory * 3;
  lbTemp.totalPoints += Number(htg === atg);
  lbTemp.totalGames += 1;
  lbTemp.totalVictories += victory;
  lbTemp.totalDraws += Number(htg === atg);
  lbTemp.totalLosses += defeat;
  lbTemp.goalsFavor = home ? lbTemp.goalsFavor + htg : lbTemp.goalsFavor + atg;
  lbTemp.goalsOwn = home ? lbTemp.goalsOwn + atg : lbTemp.goalsOwn + htg;
  lbTemp.goalsBalance = lbTemp.goalsFavor - lbTemp.goalsOwn;
  lbTemp.efficiency = Number(((lb.totalPoints / (lb.totalGames * 3)) * 100).toFixed(2));
};

const createLeaderboard = (teams: Team[], matches: MatchDTO[]) => {
  const leaderboard = teams.map((team) => {
    const { id, teamName } = team;

    const lb = { name: teamName, ...defaultLb };

    matches.forEach((match: MatchDTO) => {
      const { homeTeam, awayTeam } = match;
      if (homeTeam === id || awayTeam === id) {
        assignLBValues(lb, id, match);
      }
    });
    return lb;
  });
  return leaderboard;
};

const createLeaderboardHome = (teams: Team[], matches: MatchDTO[]) => {
  const leaderboard = teams.map((team) => {
    const { id, teamName } = team;

    const lb = { name: teamName, ...defaultLb };

    matches.forEach((match: MatchDTO) => {
      const { homeTeam } = match;
      if (homeTeam === id) {
        assignLBValues(lb, id, match);
      }
    });
    return lb;
  });
  return leaderboard;
};

const createLeaderboardAway = (teams: Team[], matches: MatchDTO[]) => {
  const leaderboard = teams.map((team) => {
    const { id, teamName } = team;

    const lb = { name: teamName, ...defaultLb };

    matches.forEach((match: MatchDTO) => {
      const { awayTeam } = match;
      if (awayTeam === id) {
        assignLBValues(lb, id, match);
      }
    });
    return lb;
  });
  return leaderboard;
};

const sortLb = (a: LeaderboardDTO, b: LeaderboardDTO) => {
  const { totalPoints: tpa, goalsBalance: gba, goalsFavor: gfa, goalsOwn: goa } = a;
  const { totalPoints: tpb, goalsBalance: gbb, goalsFavor: gfb, goalsOwn: gob } = b;
  if (tpa !== tpb) return tpb - tpa;
  if (gba !== gbb) return gbb - gba;
  if (gfa !== gfb) return gfb - gfa;
  return gob - goa;
};

export default class LeaderboardService {
  static async getAll(): Promise<LeaderboardDTO[]> {
    const teams = await Team.findAll();
    const matches = await MatchService.getAll(false);
    return createLeaderboard(teams, matches).sort(sortLb);
  }

  static async getAllHome(): Promise<LeaderboardDTO[]> {
    const teams = await Team.findAll();
    const matches = await MatchService.getAll(false);
    return createLeaderboardHome(teams, matches).sort(sortLb);
  }

  static async getAllAway(): Promise<LeaderboardDTO[]> {
    const teams = await Team.findAll();
    const matches = await MatchService.getAll(false);
    return createLeaderboardAway(teams, matches).sort(sortLb);
  }
}
