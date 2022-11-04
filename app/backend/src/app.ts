/* istanbul ignore file */
import * as express from 'express';
import * as bodyParser from 'body-parser';
import UserController from './controllers/User.controller';
import TeamController from './controllers/Team.controller';
import MatchController from './controllers/Match.controller';
import handleError from './middlewares/errorHandler';
import validateJWT from './middlewares/validateJWT';
import LeaderboardController from './controllers/Leaderboard.controller';

class App {
  public app: express.Express;

  constructor() {
    this.app = express();

    this.config();

    // Não remover essa rota
    this.app.get('/', (req, res) => res.json({ ok: true }));

    this.app.post('/login', UserController.login);
    this.app.get('/login/validate', UserController.loginValidate);

    this.app.get('/teams', TeamController.getAll);
    this.app.get('/teams/:id', TeamController.getById);

    this.app.get('/matches', MatchController.getAll);
    this.app.post('/matches', validateJWT, MatchController.create);
    this.app.patch('/matches/:id/finish', MatchController.finish);
    this.app.patch('/matches/:id', MatchController.update);

    this.app.get('/leaderboard', LeaderboardController.getAll);
    this.app.get('/leaderboard/home', LeaderboardController.getAllHome);
    this.app.get('/leaderboard/away', LeaderboardController.getAllAway);

    this.app.use(handleError);
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(express.json());
    this.app.use(bodyParser.json());
    this.app.use(accessControl);
  }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
