const chai = require('chai')
const chaiHttp = require('chai-http');
const { server } = require('./index')
const expect = chai.expect;

chai.use(chaiHttp);

describe("Balance API Test", () => {
  it("Basic Test", async () => {
    expect(1).to.equal(1);
  });

  it("Test Hello World Endpoint", (done) => {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });

  // testing case (1)
  it("Test Get Balance Of Existing User", async () => {
    let id = 1;
    const res = await chai.request(server).get(`/balance/${id}`);
    //console.log(res.text)
    expect(res.status).to.equal(200)
  });

  // testing case (2)
  it("Test Get Balance Of Non-existent User", async () => {
    let id = 69
    const res = await chai.request(server).get(`/balance/${id}`);
    expect(res.status).to.equal(404)
  });
});
