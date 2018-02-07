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

describe('posts', () => {

    describe('list', () => {

        it('should return the list of posts in database', (done) => {

            DB.initAll('posts.list');
            const app = Express();
            app.use('/posts', PostRouter);
            Supertest(app)
                .get('/posts')
                .end((err, response) => {

                    if (err) {
                        return done(err);
                    }

                    const body = response.body;

                    expect(body).to.be.an.array();
                    expect(body).to.have.length(2);
                    done();
                });
        });

    });
});




describe('posts', () => {

    describe('id', () => {

        it('should return one posts in database',(done) => {
            DB.initAll('posts.id');
            const app = Express();
            app.use('/posts',PostRouter);
            Supertest(app)
                .get('/posts/1')
                .end((err,response) => {
                    if (err) {
                        return done(err);
                    }

                    const body = response.body;

                    expect(body.ID).to.equal(1);
                    expect(body).to.have.length(3);
                    expect(body.ID).to.be.a.number();
                    expect(body.TITLE).to.be.a.string();
                    expect(body.TITLE).to.equal('hello world');

                    done();
                });
        });

    });
});
