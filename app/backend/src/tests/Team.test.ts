import * as sinon from 'sinon';
import * as chai from 'chai';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Team from '../database/models/Team';

import { TeamMock } from './mocks/Team';

chai.use(chaiHttp);

const { expect } = chai;

describe('Team tests', () => {
  it('a rota /teams funciona corretamente', async () => {
    sinon.stub(Team, 'findAll').resolves([TeamMock] as Team[]);
    const response = await chai.request(app).get('/teams').send();
    expect(response.status).to.be.equal(200);
    expect(response.body).to.deep.equal([TeamMock.toJSON()]);
  });
  it('a rota /teams falha corretamente', async () => {
    sinon.restore();
    sinon.stub(Team, 'findAll').callsFake(() => {throw Error('erro')});
    const response = await chai.request(app).get('/teams').send();
    expect(response.status).to.be.equal(500);
    expect(response.body.message).to.be.equal('erro');
  });
  it('a rota /teams/id funciona corretamente', async () => {
    sinon.stub(Team, 'findByPk').resolves(TeamMock as Team);
    const response = await chai.request(app).get('/teams/1').send();
    expect(response.status).to.be.equal(200);
    expect(response.body).to.deep.equal(TeamMock.toJSON());
  });
  it('a rota /teams/id falha corretamente', async () => {
    sinon.restore();
    sinon.stub(Team, 'findByPk').resolves(null);
    const response = await chai.request(app).get('/teams/1').send();
    expect(response.status).to.be.equal(404);
    expect(response.body.message).to.be.equal('Team not found');
  });
});
