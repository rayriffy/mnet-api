const chai = require('chai')
const chaiHttp = require('chai-http')
const mongoose = require('mongoose')
const {after, before, describe, it} = require('mocha')

const server = require('../build/main').default

const User = mongoose.model('User')

chai.use(chaiHttp)
chai.should()

describe('API V1 Testing Unit', () => {
  let temp = {
    credentials: {
      admin: {
        authentication: {
          user: Math.random()
            .toString(36)
            .substr(2),
          pass: Math.random()
            .toString(36)
            .substr(2),
          role: 'administrator',
        },
        activation: {
          ref: null,
          isActivated: true,
        },
        profile: {
          fullname: Math.random()
            .toString(36)
            .substr(2),
          school: {
            generation: 25,
            room: 9,
          },
        },
      },
      user: {
        authentication: {
          user: Math.random()
            .toString(36)
            .substr(2),
          pass: Math.random()
            .toString(36)
            .substr(2),
          role: null,
        },
        activation: {
          ref: null,
          isActivated: false,
        },
        profile: {
          fullname: Math.random()
            .toString(36)
            .substr(2),
          school: {
            generation: null,
            room: null,
          },
        },
      },
    },
    data: {
      admin: [],
      user: [],
    },
  }

  before(done => {
    mongoose.connection.on('open', () => {
      mongoose.connection.db.dropDatabase()
      done()
    })
  })

  describe('Authentication', () => {
    describe('Authentication/Create', () => {
      describe('/GET /api/v1/auth/create', () => {
        it('it should not recive GET method', done => {
          chai
            .request(server)
            .get('/api/v1/auth/create')
            .end((e, res) => {
              res.should.have.status(405)
              res.body.should.have.property('code').eql(705)
              res.body.response.should.have.property('message').eql('invalid method')
              done()
            })
        })
      })

      describe('/POST /api/v1/auth/create', () => {
        it('it should not pass if required data is not enough', done => {
          chai
            .request(server)
            .post('/api/v1/auth/create')
            .send({
              authentication: {
                user: temp.credentials.user.authentication.user,
              },
            })
            .end((e, res) => {
              res.should.have.status(400)
              res.body.should.have.property('code').eql(702)
              res.body.response.should.have.property('message').eql('provided data is not enough')
              done()
            })
        })
      })

      describe('/POST /api/v1/auth/create', () => {
        it('it should create a user', done => {
          chai
            .request(server)
            .post('/api/v1/auth/create')
            .send({
              authentication: {
                user: temp.credentials.user.authentication.user,
                pass: temp.credentials.user.authentication.pass,
              },
              profile: {
                fullname: temp.credentials.user.profile.fullname,
              },
            })
            .end((e, res) => {
              res.should.have.status(200)
              res.body.should.have.property('code').eql(201)
              res.body.response.should.have.property('message').eql('user created')
              res.body.response.data.user.activation.should.have.property('ref')
              temp.credentials.user.activation.ref = res.body.response.data.user.activation.ref
              done()
            })
        })

        it('it create admin user for future testing', done => {
          chai
            .request(server)
            .post('/api/v1/auth/create')
            .send({
              authentication: {
                user: temp.credentials.admin.authentication.user,
                pass: temp.credentials.admin.authentication.pass,
              },
              profile: {
                fullname: temp.credentials.admin.profile.fullname,
              },
            })
            .end((e, res) => {
              res.should.have.status(200)
              res.body.should.have.property('code').eql(201)
              res.body.response.should.have.property('message').eql('user created')
              res.body.response.data.user.activation.should.have.property('ref')
              temp.credentials.admin.activation.ref = res.body.response.data.user.activation.ref
              done()
            })
        })
      })
    })

    describe('Authentication/Login', () => {
      before(done => {
        User.updateOne(
          {'authentication.user': {$eq: temp.credentials.admin.authentication.user}},
          {
            $set: {
              'authentication.role': temp.credentials.admin.authentication.role,
              'activation.isActivated': temp.credentials.admin.activation.isActivated,
            },
          },
          err => {
            if (err) throw err
            else done()
          },
        )
      })

      describe('/GET /api/v1/auth/login', () => {
        it('it should not recive GET method', done => {
          chai
            .request(server)
            .get('/api/v1/auth/login')
            .end((e, res) => {
              res.should.have.status(405)
              res.body.should.have.property('code').eql(705)
              res.body.response.should.have.property('message').eql('invalid method')
              done()
            })
        })
      })

      describe('/POST /api/v1/auth/login', () => {
        it('it should not pass if required data is not enough', done => {
          chai
            .request(server)
            .post('/api/v1/auth/login')
            .send({
              authentication: {
                user: temp.credentials.user.authentication.user,
              },
            })
            .end((e, res) => {
              res.should.have.status(400)
              res.body.should.have.property('code').eql(702)
              res.body.response.should.have.property('message').eql('provided data is not enough')
              done()
            })
        })
      })

      describe('/POST /api/v1/auth/login', () => {
        it('it should logged in', done => {
          chai
            .request(server)
            .post('/api/v1/auth/login')
            .send({
              authentication: {
                user: temp.credentials.user.authentication.user,
                pass: temp.credentials.user.authentication.pass,
              },
            })
            .end((e, res) => {
              res.should.have.status(200)
              res.body.should.have.property('code').eql(201)
              res.body.response.should.have.property('message').eql('authenticated')
              res.body.response.data.should.have.property('token')
              temp.data.user.token = res.body.response.data.token
              done()
            })
        })

        it('it login admin for future testing', done => {
          chai
            .request(server)
            .post('/api/v1/auth/login')
            .send({
              authentication: {
                user: temp.credentials.admin.authentication.user,
                pass: temp.credentials.admin.authentication.pass,
              },
            })
            .end((e, res) => {
              res.should.have.status(200)
              res.body.should.have.property('code').eql(201)
              res.body.response.should.have.property('message').eql('authenticated')
              res.body.response.data.should.have.property('token')
              temp.data.admin.token = res.body.response.data.token
              done()
            })
        })
      })
    })

    describe('Authentication/Activate', () => {
      describe('/GET /api/v1/user/profile', () => {
        it('it should not get pass if user not activated', done => {
          chai
            .request(server)
            .get('/api/v1/user/profile')
            .set('Authorization', temp.data.user.token)
            .end((e, res) => {
              res.should.have.status(401)
              res.body.should.have.property('code').eql(707)
              res.body.response.should.have.property('message').eql('not activated')
              done()
            })
        })
      })

      describe('/GET /api/v1/auth/activate', () => {
        it('it should not recive GET method', done => {
          chai
            .request(server)
            .get('/api/v1/auth/activate')
            .end((e, res) => {
              res.should.have.status(405)
              res.body.should.have.property('code').eql(705)
              res.body.response.should.have.property('message').eql('invalid method')
              done()
            })
        })
      })

      describe('/POST /api/v1/auth/activate', () => {
        it('it should not pass if authenticated user is not admin', done => {
          chai
            .request(server)
            .post('/api/v1/auth/activate')
            .set('Authorization', temp.data.user.token)
            .send({
              activation: {
                ref: temp.credentials.user.activation.ref,
              },
            })
            .end((e, res) => {
              res.should.have.status(400)
              res.body.should.have.property('code').eql(707)
              res.body.response.should.have.property('message').eql('insufficient permission')
              done()
            })
        })
      })

      describe('/POST /api/v1/auth/activate', () => {
        it('it should not pass if required data is not enough', done => {
          chai
            .request(server)
            .post('/api/v1/auth/activate')
            .set('Authorization', temp.data.admin.token)
            .send()
            .end((e, res) => {
              res.should.have.status(400)
              res.body.should.have.property('code').eql(702)
              res.body.response.should.have.property('message').eql('provided data is not enough')
              done()
            })
        })
      })

      describe('/POST /api/v1/auth/activate', () => {
        it('it should not pass if req is not found', done => {
          chai
            .request(server)
            .post('/api/v1/auth/activate')
            .set('Authorization', temp.data.admin.token)
            .send({
              activation: {
                ref: 'lel',
              },
            })
            .end((e, res) => {
              res.should.have.status(404)
              res.body.should.have.property('code').eql(704)
              res.body.response.should.have.property('message').eql('ref code is not found')
              done()
            })
        })
      })

      describe('/POST /api/v1/auth/activate', () => {
        it('it should activate user', done => {
          chai
            .request(server)
            .post('/api/v1/auth/activate')
            .set('Authorization', temp.data.admin.token)
            .send({
              activation: {
                ref: temp.credentials.user.activation.ref,
              },
            })
            .end((e, res) => {
              res.should.have.status(200)
              res.body.should.have.property('code').eql(201)
              res.body.response.should.have.property('message').eql('user activated')
              temp.credentials.user.activation.isActivated = true
              done()
            })
        })
      })
    })
  })

  describe('User', () => {
    describe('User/Profile', () => {
      describe('/GET /api/v1/user/profile', () => {
        it('it should not pass if user not authenticated', done => {
          chai
            .request(server)
            .get('/api/v1/user/profile')
            .end((e, res) => {
              res.should.have.status(401)
              res.body.should.have.property('code').eql(703)
              res.body.response.should.have.property('message').eql('unauthorized')
              done()
            })
        })
      })

      describe('/POST /api/v1/user/profile', () => {
        it('it should not revive POST method', done => {
          chai
            .request(server)
            .post('/api/v1/user/profile')
            .set('Authorization', temp.data.user.token)
            .end((e, res) => {
              res.should.have.status(405)
              res.body.should.have.property('code').eql(705)
              res.body.response.should.have.property('message').eql('invalid method')
              done()
            })
        })
      })

      describe('/GET /api/v1/user/profile', () => {
        it('it should have required response', done => {
          chai
            .request(server)
            .get('/api/v1/user/profile')
            .set('Authorization', temp.data.user.token)
            .end((e, res) => {
              res.should.have.status(200)
              res.body.should.have.property('code').eql(201)
              res.body.response.should.have.property('message').eql('user data recived')
              res.body.response.data.user.should.have.property('id')
              res.body.response.data.user.authentication.should.have.property('user')
              res.body.response.data.user.authentication.should.have.property('role')
              res.body.response.data.user.activation.should.have.property('isActivated')
              res.body.response.data.user.activation.should.have.property('ref')
              res.body.response.data.user.profile.should.have.property('fullname')
              res.body.response.data.user.profile.school.should.have.property('generation')
              res.body.response.data.user.profile.school.should.have.property('room')
              done()
            })
        })
      })
    })

    describe('User/Update', () => {
      describe('/PUT /api/v1/user/update', () => {
        it('it should not pass if user not authenticated', done => {
          chai
            .request(server)
            .put('/api/v1/user/update')
            .end((e, res) => {
              res.should.have.status(401)
              res.body.should.have.property('code').eql(703)
              res.body.response.should.have.property('message').eql('unauthorized')
              done()
            })
        })
      })

      describe('/GET /api/v1/user/update', () => {
        it('it should not revice GET method', done => {
          chai
            .request(server)
            .get('/api/v1/user/update')
            .set('Authorization', temp.data.user.token)
            .end((e, res) => {
              res.should.have.status(405)
              res.body.should.have.property('code').eql(705)
              res.body.response.should.have.property('message').eql('invalid method')
              done()
            })
        })
      })

      describe('/PUT /api/v1/user/update', () => {
        it('it should update user information', done => {
          chai
            .request(server)
            .put('/api/v1/user/update')
            .set('Authorization', temp.data.user.token)
            .send({
              profile: {
                fullname: 'test-user2',
              },
            })
            .end((e, res) => {
              res.should.have.status(200)
              res.body.should.have.property('code').eql(201)
              res.body.response.should.have.property('message').eql('user updated')
              done()
            })
        })
      })
    })
  })

  after(done => {
    mongoose.connection.db.dropDatabase()
    done()
  })
})
