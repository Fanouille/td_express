'use strict';
const Code = require('code');
const expect = Code.expect;
const Lab = require('lab');
const lab  = module.exports.lab = Lab.script();

const Supertest = require('supertest');
const Express = require('express');
const PostRouter = require('../../routes/posts.js').router;
const DB = require('../../db.js');

const describe = lab.describe;
const it = lab.it;

describe('bottles', () => {

    describe('list', () => {

        it('should return the list of bottles in database', (done) => {

            DB.initAll('bottles.list');
            const app = Express();
            app.use('/bottles', PostRouter);
            Supertest(app)
                .get('/bottles')
                .end((err, response) => {

                    if (err) {
                        return done(err);
                    }

                    const body = response.body;

                    expect(body).to.be.an.array();
                    expect(body).to.have.length(1);
                    done();
                });
        });

    });
});

