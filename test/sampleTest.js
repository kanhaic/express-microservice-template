process.env.NODE_ENV = 'test'
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('./src/index.js')
const expect = chai.expect
chai.use(chaiHttp)

describe('Service ', () => {
  it('should have a healthcheck', (done) => {
    chai.request(app).get('/health')
      .end((err, res) => {
        if (err) done(err)
        expect(res.status).to.equal(200)
        done()
      })
  })

  it('should have a metrics', (done) => {
    chai.request(app).get('/metrics')
      .end((err, res) => {
        if (err) done(err)
        expect(res.status).to.equal(200)
        done()
      })
  })
})
