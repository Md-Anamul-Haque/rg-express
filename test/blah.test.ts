import express from 'express';
import { rg } from '../src';
// import supertest from 'supertest';

const app = express();

const routerGenerators = new rg(app);
if ('development' === process.env.NODE_ENV) {
  routerGenerators.runDevBuilder();
  routerGenerators.init();
}

describe('blah', () => {
  it('works', async () => {
    expect(routerGenerators);
    // expect(routerGenerators).toEqual(4);
    // You can add more assertions based on the response data if needed
  });
});

// describe('blah', () => {
//   it('works', () => {
//     expect(sum(1, 1)).toEqual(2);
//   });
// });
