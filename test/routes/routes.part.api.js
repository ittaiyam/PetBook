'use strict';

function testSuite(app) {
    describe('API controller unit testing...', function () {
        var expect = require('chai').expect;
        var request = require('supertest');
        var dao = app.get('dao');
        var user_1;
        var user_2;
        var petId;

        before(function (done) {
            var userData_1 = {
                name: 'Alan Turing',
                email: 'a.turing@gmail.com'
            };
            var userData_2 = {
                name: 'Marie Curie',
                email: 'mc1867@gmail.com'
            };
            dao.user.extendedCreate(userData_1, onCreateFirstUserDone);

            function onCreateFirstUserDone(error, result) {
                if (error || !result) {
                    throw error || 'No result!';
                } else {
                    result.populate('token', onPopulateFirstUserDone);
                }
            }

            function onPopulateFirstUserDone(error, result) {
                if (error || !result) {
                    throw error || 'No result!';
                } else {
                    user_1 = result;
                    dao.user.extendedCreate(userData_2, onCreateSecondUserDone);
                }
            }

            function onCreateSecondUserDone(error, result) {
                if (error || !result) {
                    throw error || 'No result!';
                } else {
                    result.populate('token', onPopulateSecondUserDone);
                }
            }

            function onPopulateSecondUserDone(error, result) {
                if (error || !result) {
                    throw error || 'No result!';
                } else {
                    user_2 = result;
                    done();
                }
            }
        });

        describe('Testing:  POST /pet', function () {
            it('should not create a new pet.', function (done) {
                var postData = {
                    access_token: user_1.token.value,
                    name: 'Mizzi',
                    age: 3,
                    type: 'British Blue'
                };
                request(app)
                    .post('/api/pet')
                    .set('Accept', 'application/json')
                    .send(postData)
                    .expect(400)
                    .end(function (error, result) {
                        expect(!error && result).to.be.ok;
                        expect(result.res.body.msg).to.be.equal('Bad request. Check for missing parameters.');
                        done();
                    });
            });

            it('should create a new pet.', function (done) {
                var postData = {
                    access_token: user_1.token.value,
                    name: 'Mizzi',
                    description: 'is a cat...',
                    age: 3,
                    species: 'cat',
                    type: 'British Blue',
                    gender: 'female'
                };
                request(app)
                    .post('/api/pet')
                    .set('Accept', 'application/json')
                    .send(postData)
                    .expect(200)
                    .end(function (error, result) {
                        expect(!error && result).to.be.ok;
                        expect(result.res.body.name).to.be.equal(postData.name);
                        expect(result.res.body.description).to.be.equal(postData.description);
                        expect(result.res.body.age).to.be.equal(postData.age);
                        expect(result.res.body.species).to.be.equal(postData.species);
                        expect(result.res.body.type).to.be.equal(postData.type);
                        expect(result.res.body.gender).to.be.equal(postData.gender);
                        expect(result.res.body.adopted).not.to.be.ok;
                        expect(result.res.body.user.toString()).to.be.equal(user_1._id.toString());
                        petId = result.res.body._id;
                        done();
                    });
            });
        });

        describe('Testing:  PUT /pet', function () {
            it('should not edit the pet.', function (done) {
                var putData = {
                    access_token: user_1.token.value,
                    petId: petId,
                    description: {name: 'miri', age: 27}
                };
                request(app)
                    .put('/api/pet')
                    .set('Accept', 'application/json')
                    .send(putData)
                    .expect(400)
                    .end(function (error, result) {
                        expect(!error && result).to.be.ok;
                        expect(result.res.body.msg).to.be.equal('Bad request. Check for parameters\' validity.');
                        done();
                    });
            });

            it('should not edit the pet.', function (done) {
                var putData = {
                    access_token: user_2.token.value,
                    petId: petId
                };
                request(app)
                    .put('/api/pet')
                    .set('Accept', 'application/json')
                    .send(putData)
                    .expect(403)
                    .end(function (error, result) {
                        expect(!error && result).to.be.ok;
                        expect(result.res.body.msg).to.be.equal('Forbidden action. You can\'t do that!');
                        done();
                    });
            });

            it('should edit the pet.', function (done) {
                var putData = {
                    access_token: user_1.token.value,
                    petId: petId,
                    name: 'Garfield',
                    description: 'likes lasagna',
                    age: 100,
                    type: 'tabby cat',
                    gender: 'male',
                    adopted: true
                };
                request(app)
                    .put('/api/pet')
                    .set('Accept', 'application/json')
                    .send(putData)
                    .expect(200)
                    .end(function (error, result) {
                        expect(!error && result).to.be.ok;
                        expect(result.res.body.name).to.be.equal(putData.name);
                        expect(result.res.body.description).to.be.equal(putData.description);
                        expect(result.res.body.age).to.be.equal(putData.age);
                        expect(result.res.body.type).to.be.equal(putData.type);
                        expect(result.res.body.gender).to.be.equal(putData.gender);
                        expect(result.res.body.adopted).to.be.equal(putData.adopted);
                        done();
                    });
            });
        });
    });
}

module.exports = testSuite;