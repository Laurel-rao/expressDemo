let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');

let should = chai.should();
chai.use(chaiHttp);
// https://blog.csdn.net/prufeng/article/details/83869939
describe('App', () => {
    it('should respond status 200', (done) => {
        chai.request(app)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
    it('should GET the users response', (done) => {
        chai.request(app)
            .get('/goo', ).send({"data1": "1"})
            .end((err, res) => {
                res.should.have.status(200);
                res.text.should.equal("goo");
                done();
            });
    });

    it('should respond status 404', (done) => {
        chai.request(app)
            .get('/wrongUrl')
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
    });
});
