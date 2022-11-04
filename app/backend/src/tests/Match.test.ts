import * as sinon from 'sinon';
import * as chai from 'chai';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Example from '../database/models/ExampleModel';
import User from '../database/models/User';
import Match from '../database/models/Match';
import Team from '../database/models/Team';

import { Response } from 'superagent';
import { UserMock } from './mocks/User';
import { MatchMock } from './mocks/Match';
import { TeamMock } from './mocks/Team';

chai.use(chaiHttp);

const { expect } = chai;

describe('Match tests', () => {
  it('a rota get /matches funciona corretamente', async () => {
    sinon.stub(User, 'findAll').resolves([UserMock] as User[]);
    sinon.stub(jwt, 'verify').callsFake(() => ({ data: UserMock }));
    sinon.stub(Match, 'findAll').resolves([MatchMock] as Match[]);
    const response = await chai.request(app).get('/matches').set('Authorization', 'token');
    expect(response.status).to.be.equal(200);
    expect(response.body).to.deep.equal([MatchMock.toJSON()]);
  });
  it('a rota get /matches com query funciona corretamente', async () => {
    const response = await chai.request(app).get('/matches').set('Authorization', 'token').query({ inProgress: 'true' });
    expect(response.status).to.be.equal(200);
    expect(response.body).to.deep.equal([MatchMock.toJSON()]);
  });
  it('a rota get /matches falha corretamente', async () => {
    sinon.restore();
    sinon.stub(User, 'findAll').resolves([UserMock] as User[]);
    sinon.stub(jwt, 'verify').callsFake(() => ({ data: UserMock }));
    sinon.stub(Match, 'findAll').callsFake(() => { throw new Error('falha') });
    const response = await chai.request(app).get('/matches').set('Authorization', 'token');
    expect(response.status).to.be.equal(500);
    expect(response.body.message).to.be.equal('falha');
  });
  it('a rota post /matches funciona corretamente', async () => {
    sinon.restore();
    sinon.stub(User, 'findAll').resolves([UserMock] as User[]);
    sinon.stub(jwt, 'verify').callsFake(() => ({ data: UserMock }));
    sinon.stub(Match, 'create').resolves(MatchMock as Match);
    sinon.stub(Team, 'findByPk').resolves(TeamMock as Team);
    const response = await chai.request(app).post('/matches').set('Authorization', 'token').send(MatchMock);
    expect(response.status).to.be.equal(201);
    expect(response.body).to.deep.equal(MatchMock.toJSON());
  });
  it('a rota post /matches falha se os 2 times forem iguais', async () => {
    const response = await chai.request(app).post('/matches').set('Authorization', 'token').send();
    expect(response.status).to.be.equal(422);
    expect(response.body.message).to.be.equal('It is not possible to create a match with two equal teams');
  });
  it('a rota post /matches falha se um dos times não existir', async () => {
    sinon.restore();
    sinon.stub(User, 'findAll').resolves([UserMock] as User[]);
    sinon.stub(jwt, 'verify').callsFake(() => ({ data: UserMock }));
    sinon.stub(Match, 'create').resolves(MatchMock as Match);
    sinon.stub(Team, 'findByPk').resolves(undefined);
    const response = await chai.request(app).post('/matches').set('Authorization', 'token').send(MatchMock);
    expect(response.status).to.be.equal(404);
    expect(response.body.message).to.be.equal('There is no team with such id!');
  });
  it('a rota /matches/:id/finish funciona corretamente', async () => {
    sinon.restore();
    sinon.stub(Match, 'update').resolves(undefined);
    const response = await chai.request(app).patch('/matches/50/finish').send();
    expect(response.status).to.be.equal(200);
    expect(response.body.message).to.be.equal('Finished');
  });
  it('a rota /matches/:id/finish falha corretamente', async () => {
    sinon.restore();
    sinon.stub(Match, 'update').callsFake(() => { throw new Error('falha') });
    const response = await chai.request(app).patch('/matches/50/finish').send();
    expect(response.status).to.be.equal(500);
    expect(response.body.message).to.be.equal('falha');
  });
  it('a rota /matches/:id funciona corretamente', async () => {
    sinon.restore();
    sinon.stub(Match, 'update').resolves(undefined);
    const response = await chai.request(app).patch('/matches/50').send();
    expect(response.status).to.be.equal(200);
    expect(response.body.message).to.be.equal('Updated');
  });
  it('a rota /matches/:id falha corretamente', async () => {
    sinon.restore();
    sinon.stub(Match, 'update').callsFake(() => { throw new Error('falha') });
    const response = await chai.request(app).patch('/matches/50').send();
    expect(response.status).to.be.equal(500);
    expect(response.body.message).to.be.equal('falha');
  });
  // it('a rota /login falha caso não especificado email ou senha', async () => {
  //   const response = await chai.request(app).post('/login').send({});
  //   expect(response.status).to.be.equal(400);
  //   expect(response.body.message).to.be.equal('All fields must be filled');
  // });
  // it('a rota /login falha caso não encontrado o usuario', async () => {
  //   sinon.restore();
  //   sinon.stub(User, 'findOne').resolves(null);
  //   const response = await chai.request(app).post('/login').send(UserMock);
  //   expect(response.status).to.be.equal(401);
  //   expect(response.body.message).to.be.equal('Incorrect email or password');
  // });
  // it('a rota /login falha caso a senha seja incorreta', async () => {
  //   sinon.restore();
  //   sinon.stub(User, 'findOne').resolves(UserMock as User);
  //   sinon.stub(bcrypt, 'compareSync').callsFake(() => false);
  //   const response = await chai.request(app).post('/login').send(UserMock);
  //   expect(response.status).to.be.equal(401);
  //   expect(response.body.message).to.be.equal('Incorrect email or password');
  // });
  // it('a rota /login/validate funciona corretamente', async () => {
  //   sinon.restore();
  //   sinon.stub(User, 'findOne').resolves(UserMock as User);
  //   sinon.stub(jwt, 'verify').callsFake(() => ({ data: UserMock }));
  //   const response = await chai.request(app).get('/login/validate').set('Authorization', 'token').send();
  //   expect(response.status).to.be.equal(200);
  //   expect(response.body).to.include.keys('role');
  //   expect(response.body.role).to.be.equal('admin');
  // });
  // it('a rota /login/validate falha ao não encontrar um user', async () => {
  //   sinon.restore();
  //   sinon.stub(User, 'findOne').resolves(null);
  //   sinon.stub(jwt, 'verify').callsFake(() => ({ data: UserMock }));
  //   const response = await chai.request(app).get('/login/validate').set('Authorization', 'token').send();
  //   expect(response.status).to.be.equal(404);
  //   expect(response.body.message).to.be.equal('User not found');
  // });
});
