'use strict';

function testSuite(dao) {
    describe('User model unit testing', function () {
        var expect = require('chai').expect;
        var user;

        describe('Testing: Extended Create...', function(){
            it('should create a new user.', function(done){
                var data = {
                    name: 'James Joyce',
                    email: 'jjoyce@gmail.com'
                };
                var earlier = new Date();
                dao.user.extendedCreate(data, onCreateDone, false);

                function onCreateDone(error, result){
                    expect(!error && result).to.be.ok;
                    result.populate('token', onPopulateDone);
                    user = result;
                }

                function onPopulateDone(error, result){
                    var now = new Date();
                    expect(!error && result).to.be.ok;
                    expect(result.name).to.equal(data.name);
                    expect(result.email).to.equal(data.email);
                    expect(result.enabled).to.equal(true);
                    expect(result.token.value).to.have.length(32);
                    expect(result.regDate).to.be.within(earlier, now);
                    done();
                }
            });
        });

        describe('Testing: Generate Token...', function(){
            it('should generate a new token.', function(done){
                var oldTokenValue = user.token.value;
                var newTokenValue;
                user.generateToken(onGenerateTokenDone);

                function onGenerateTokenDone(error, result){
                    expect(!error && result).to.be.ok;
                    newTokenValue = result.value;
                    user.populate('token', onPopulateDone);
                }

                function onPopulateDone(error, result){
                    expect(!error && result).to.be.ok;
                    expect(result.token.value).to.not.be.equal(oldTokenValue);
                    expect(result.token.value).to.be.equal(newTokenValue);
                    done();
                }
            });
        });
    });
}

module.exports = testSuite;