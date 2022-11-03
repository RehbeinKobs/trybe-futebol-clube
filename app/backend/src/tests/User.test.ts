import * as sinon from 'sinon';
import * as chai from 'chai';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Example from '../database/models/ExampleModel';
import User from '../database/models/User';

import { Response } from 'superagent';
import { UserMock } from './mocks/User';

chai.use(chaiHttp);

const { expect } = chai;

describe('Seu teste', () => {
  it('a rota /login funciona corretamente', async () => {
    sinon.stub(User, 'findOne').resolves(UserMock as User);
    sinon.stub(bcrypt, 'compareSync').callsFake(() => true);
    sinon.stub(jwt, 'sign').callsFake(() => 'token');
    const response = await chai.request(app).post('/login').send(UserMock);
    expect(response.status).to.be.equal(200);
    expect(response.body).to.include.keys('token');
  });
  it('a rota /login falha caso não especificado email ou senha', async () => {
    const response = await chai.request(app).post('/login').send({});
    expect(response.status).to.be.equal(400);
    expect(response.body.message).to.be.equal('All fields must be filled');
  });
  it('a rota /login falha caso não encontrado o usuario', async () => {
    sinon.restore();
    sinon.stub(User, 'findOne').resolves(null);
    const response = await chai.request(app).post('/login').send(UserMock);
    expect(response.status).to.be.equal(401);
    expect(response.body.message).to.be.equal('Incorrect email or password');
  });
  it('a rota /login falha caso a senha seja incorreta', async () => {
    sinon.restore();
    sinon.stub(User, 'findOne').resolves(UserMock as User);
    sinon.stub(bcrypt, 'compareSync').callsFake(() => false);
    const response = await chai.request(app).post('/login').send(UserMock);
    expect(response.status).to.be.equal(401);
    expect(response.body.message).to.be.equal('Incorrect email or password');
  });
  it('a rota /login/validate funciona corretamente', async () => {
    sinon.restore();
    sinon.stub(User, 'findOne').resolves(UserMock as User);
    sinon.stub(jwt, 'verify').callsFake(() => ({ data: UserMock }));
    const response = await chai.request(app).get('/login/validate').set('Authorization', 'token').send();
    expect(response.status).to.be.equal(200);
    expect(response.body).to.include.keys('role');
    expect(response.body.role).to.be.equal('admin');
  });
  it('a rota /login/validate falha ao não encontrar um user', async () => {
    sinon.restore();
    sinon.stub(User, 'findOne').resolves(null);
    sinon.stub(jwt, 'verify').callsFake(() => ({ data: UserMock }));
    const response = await chai.request(app).get('/login/validate').set('Authorization', 'token').send();
    expect(response.status).to.be.equal(404);
    expect(response.body.message).to.be.equal('User not found');
  });
});
