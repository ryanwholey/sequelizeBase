var User = require('../models/User');
var Question = require('../models/Question');

describe('User model', function() {

    it('should define a user', function(done) {
        var attrs = {username: 'Ryan'};

        User.findOne({where:attrs})
            .then((obj) => !obj ? User.create(attrs) : obj)
            .then(() => User.findOne({where:attrs}))
            .then((obj) => obj.get('username'))
            .then((username) => expect(username).toEqual('Ryan'))
            .catch((err) => expect(username).toEqual('Ryan'))
            .finally(done)
    });

    it('should not find a user', function(done) {
        let attrs = {username: 'jonas'};

        User.findAll({ where: attrs}) 
            .then((results) => expect(results.length).toEqual(0)) 
            .finally(done);
    });

    it('should add a default group', function(done) {
        let attrs = {username: 'Ryan'};

        User.findOne({where: attrs})
            .then((obj) => obj.get('group'))
            .then((group) => expect(group).toEqual('general'))
            .catch((err) => expect(err).toEqual('default'))
            .finally(done);
    });

    it('should save a default group', function(done) {
        let attrs = {username: 'Shmoo', group: 'ACYPAAJ'};

        User.findOne({where: attrs})
            .then((obj) => !obj ? User.create(attrs) : obj)
            .then((obj) => obj.get('group'))
            .then((group) => expect(group).toEqual('ACYPAAJ'))
            .catch((err) => expect(err).toEqual(''))
            .finally(done);
    });
});

describe('Question model', () => {
    
    it('should create a basic question instant', (done) => {
        let attrs = {
            question: 'who likes node',
            answer: 'i like node',
            category: 'programming',
            value: 100,
        };

        Question.findOne({where: attrs}) 
            .then((obj) => !obj ? Question.create(attrs) : obj)
            .then((obj) => obj.get('question'))
            .then((question) => expect(question).toEqual(attrs.question))
            .catch((err) => expect(err).toEqual(''))
            .finally(done)
    });
});
