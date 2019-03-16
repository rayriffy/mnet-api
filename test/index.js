const _ = require('lodash')
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
      announces: [],
      other: [],
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
              temp.data.user.id = res.body.response.data.user.id
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
              temp.data.admin.id = res.body.response.data.user.id
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
              res.should.have.status(401)
              res.body.should.have.property('code').eql(707)
              res.body.response.should.have.property('message').eql('insufficient permission')
              done()
            })
        })

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

        it('it should not pass if ref code is not found', done => {
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
        it('it should handle not found event', done => {
          chai
            .request(server)
            .get('/api/v1/user/profile/iamnumberten/full')
            .set('Authorization', temp.data.user.token)
            .end((e, res) => {
              res.should.have.status(404)
              res.body.should.have.property('code').eql(704)
              res.body.response.should.have.property('message').eql('user not found')
              done()
            })
        })

        it('it should have required full response', done => {
          chai
            .request(server)
            .get('/api/v1/user/profile/' + temp.data.user.id + '/full')
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

        it('it should have required full response', done => {
          chai
            .request(server)
            .get('/api/v1/user/profile/' + temp.data.user.id + '/min')
            .set('Authorization', temp.data.user.token)
            .end((e, res) => {
              res.should.have.status(200)
              res.body.should.have.property('code').eql(201)
              res.body.response.should.have.property('message').eql('user data recived')
              res.body.response.data.user.should.have.property('id')
              res.body.response.data.user.authentication.should.have.property('user')
              res.body.response.data.user.profile.should.have.property('fullname')
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

  describe('Announcement', () => {
    describe('Announcement/Create', () => {
      describe('/GET /api/v1/announce/create', () => {
        it('it should not pass if user not authenticated', done => {
          chai
            .request(server)
            .get('/api/v1/announce/create')
            .end((e, res) => {
              res.should.have.status(401)
              res.body.should.have.property('code').eql(703)
              res.body.response.should.have.property('message').eql('unauthorized')
              done()
            })
        })

        it('it should not recive GET method', done => {
          chai
            .request(server)
            .get('/api/v1/announce/create')
            .set('Authorization', temp.data.user.token)
            .end((e, res) => {
              res.should.have.status(405)
              res.body.should.have.property('code').eql(705)
              res.body.response.should.have.property('message').eql('invalid method')
              done()
            })
        })
      })

      describe('/POST /api/v1/announce/create', () => {
        it('it should not get pass if authenticated user is not admin', done => {
          chai
            .request(server)
            .post('/api/v1/announce/create')
            .set('Authorization', temp.data.user.token)
            .end((e, res) => {
              res.should.have.status(401)
              res.body.should.have.property('code').eql(707)
              res.body.response.should.have.property('message').eql('insufficient permission')
              done()
            })
        })

        it('it should not pass if required data is not enough', done => {
          chai
            .request(server)
            .post('/api/v1/announce/create')
            .set('Authorization', temp.data.admin.token)
            .end((e, res) => {
              res.should.have.status(400)
              res.body.should.have.property('code').eql(702)
              res.body.response.should.have.property('message').eql('provided data is not enough')
              done()
            })
        })

        _.times(10, i => {
          it('it should create announcement (' + (i + 1) + '/10)', done => {
            chai
              .request(server)
              .post('/api/v1/announce/create')
              .set('Authorization', temp.data.admin.token)
              .send({
                announce: {
                  to: ['mwit25', 'mwit26', 'mwit27'],
                  message: {
                    title: Math.random()
                      .toString(36)
                      .substr(2),
                    body: Math.random()
                      .toString(36)
                      .substr(2),
                  },
                },
              })
              .end((e, res) => {
                res.should.have.status(202)
                res.body.should.have.property('code').eql(202)
                res.body.response.should.have
                  .property('message')
                  .eql('announce created and being notified to specified users')
                res.body.response.data.should.have.property('announce')
                res.body.response.data.announce.should.have.property('id')
                res.body.response.data.announce.should.have.property('date')
                res.body.response.data.announce.should.have.property('message')
                res.body.response.data.announce.should.have.property('from')
                res.body.response.data.announce.should.have.property('to')
                temp.data.announces.push(res.body.response.data.announce.id)
                done()
              })
          })
        })
      })
    })

    describe('Announcement/Get', () => {
      describe('/POST /api/v1/announce/get', () => {
        it('it should not pass if user not authenticated', done => {
          chai
            .request(server)
            .post(
              '/api/v1/announce/get/' + temp.data.announces[Math.floor(Math.random() * (temp.data.announces.length - 1))],
            )
            .end((e, res) => {
              res.should.have.status(401)
              res.body.should.have.property('code').eql(703)
              res.body.response.should.have.property('message').eql('unauthorized')
              done()
            })
        })

        it('it should not recive POST method', done => {
          chai
            .request(server)
            .post(
              '/api/v1/announce/get/' + temp.data.announces[Math.floor(Math.random() * (temp.data.announces.length - 1))],
            )
            .set('Authorization', temp.data.user.token)
            .end((e, res) => {
              res.should.have.status(405)
              res.body.should.have.property('code').eql(705)
              res.body.response.should.have.property('message').eql('invalid method')
              done()
            })
        })
      })

      describe('/GET /api/v1/announce/get', () => {
        it('it should have required response', done => {
          chai
            .request(server)
            .get('/api/v1/announce/get/' + temp.data.announces[Math.floor(Math.random() * (temp.data.announces.length - 1))])
            .set('Authorization', temp.data.user.token)
            .end((e, res) => {
              res.should.have.status(200)
              res.body.should.have.property('code').eql(201)
              res.body.response.should.have.property('message').eql('announce data recived')
              res.body.response.data.should.have.property('announce')
              res.body.response.data.announce.should.have.property('id')
              res.body.response.data.announce.should.have.property('date')
              res.body.response.data.announce.should.have.property('message')
              res.body.response.data.announce.should.have.property('from')
              res.body.response.data.announce.should.have.property('to')
              res.body.response.data.announce.like.should.have.property('count')
              done()
            })
        })

        it('it should be able to handle not found event', done => {
          chai
            .request(server)
            .get(
              '/api/v1/announce/get/' +
                Math.random()
                  .toString(36)
                  .substr(2),
            )
            .set('Authorization', temp.data.user.token)
            .end((e, res) => {
              res.should.have.status(404)
              res.body.should.have.property('code').eql(704)
              res.body.response.should.have.property('message').eql('announce not found')
              done()
            })
        })
      })
    })

    describe('Announcement/List', () => {
      describe('/POST /api/v1/announce/list', () => {
        it('it should not pass if user not authenticated', done => {
          chai
            .request(server)
            .post('/api/v1/announce/list/1')
            .end((e, res) => {
              res.should.have.status(401)
              res.body.should.have.property('code').eql(703)
              res.body.response.should.have.property('message').eql('unauthorized')
              done()
            })
        })

        it('it should not recive POST method', done => {
          chai
            .request(server)
            .post('/api/v1/announce/list/1')
            .set('Authorization', temp.data.user.token)
            .end((e, res) => {
              res.should.have.status(405)
              res.body.should.have.property('code').eql(705)
              res.body.response.should.have.property('message').eql('invalid method')
              done()
            })
        })
      })

      describe('/GET /api/v1/announce/list', () => {
        it('it should have required response', done => {
          chai
            .request(server)
            .get('/api/v1/announce/list/1')
            .set('Authorization', temp.data.user.token)
            .end((e, res) => {
              res.should.have.status(200)
              res.body.should.have.property('code').eql(201)
              res.body.response.should.have.property('message').eql('announces data recived')
              res.body.response.should.have.property('data')
              res.body.response.data.should.have.property('announce')
              res.body.response.data.announce.should.be.an('array')
              res.body.response.data.announce.length.should.eql(10)
              done()
            })
        })

        it('it should be able to handle not found event', done => {
          chai
            .request(server)
            .get('/api/v1/announce/list/2')
            .set('Authorization', temp.data.user.token)
            .end((e, res) => {
              res.should.have.status(404)
              res.body.should.have.property('code').eql(704)
              res.body.response.should.have.property('message').eql('you reached the limit :(')
              done()
            })
        })
      })
    })
  })

  describe('Like', () => {
    describe('Like/Announcement', () => {
      before(done => {
        temp.data.other.selectedAnnounce = temp.data.announces[Math.floor(Math.random() * (temp.data.announces.length - 1))]
        done()
      })

      describe('Like/Announcement/Add', () => {
        describe('/GET /api/v1/like/announce/islike', () => {
          it('it should return false when not like yet', done => {
            chai
              .request(server)
              .get('/api/v1/like/announce/islike/' + temp.data.other.selectedAnnounce)
              .set('Authorization', temp.data.user.token)
              .end((e, res) => {
                res.should.have.status(200)
                res.body.should.have.property('code').eql(201)
                res.body.response.should.have.property('message').eql('here is the result')
                res.body.response.data.should.have.property('id').eql(temp.data.other.selectedAnnounce)
                res.body.response.data.should.have.property('isLike').eql(false)
                done()
              })
          })
        })

        describe('/GET /api/v1/like/announce/add', () => {
          it('it should not pass if user not authenticated', done => {
            chai
              .request(server)
              .get('/api/v1/like/announce/add/' + temp.data.other.selectedAnnounce)
              .end((e, res) => {
                res.should.have.status(401)
                res.body.should.have.property('code').eql(703)
                res.body.response.should.have.property('message').eql('unauthorized')
                done()
              })
          })

          it('it should not recive GET method', done => {
            chai
              .request(server)
              .get('/api/v1/like/announce/add/' + temp.data.other.selectedAnnounce)
              .set('Authorization', temp.data.user.token)
              .end((e, res) => {
                res.should.have.status(405)
                res.body.should.have.property('code').eql(705)
                res.body.response.should.have.property('message').eql('invalid method')
                done()
              })
          })
        })

        describe('/POST /api/v1/like/announce/add', () => {
          it('it should add like into announce', done => {
            chai
              .request(server)
              .post('/api/v1/like/announce/add/' + temp.data.other.selectedAnnounce)
              .set('Authorization', temp.data.user.token)
              .end((e, res) => {
                res.should.have.status(200)
                res.body.should.have.property('code').eql(201)
                res.body.response.should.have.property('message').eql('you liked this announce')
                done()
              })
          })

          it('it should be able to handle not found event', done => {
            chai
              .request(server)
              .post(
                '/api/v1/like/announce/add/' +
                  Math.random()
                    .toString(36)
                    .substr(2),
              )
              .set('Authorization', temp.data.user.token)
              .end((e, res) => {
                res.should.have.status(404)
                res.body.should.have.property('code').eql(704)
                res.body.response.should.have.property('message').eql('announce not found')
                done()
              })
          })
        })

        describe('/GET /api/v1/like/announce/islike', () => {
          it('it should return true after like announce', done => {
            chai
              .request(server)
              .get('/api/v1/like/announce/islike/' + temp.data.other.selectedAnnounce)
              .set('Authorization', temp.data.user.token)
              .end((e, res) => {
                res.should.have.status(200)
                res.body.should.have.property('code').eql(201)
                res.body.response.should.have.property('message').eql('here is the result')
                res.body.response.data.should.have.property('id').eql(temp.data.other.selectedAnnounce)
                res.body.response.data.should.have.property('isLike').eql(true)
                done()
              })
          })
        })
      })

      describe('Like/Announcement/Count', () => {
        describe('/POST /api/v1/like/announce/count', () => {
          it('it should not pass if user not authenticated', done => {
            chai
              .request(server)
              .post('/api/v1/like/announce/count/' + temp.data.other.selectedAnnounce)
              .end((e, res) => {
                res.should.have.status(401)
                res.body.should.have.property('code').eql(703)
                res.body.response.should.have.property('message').eql('unauthorized')
                done()
              })
          })

          it('it should not recive POST method', done => {
            chai
              .request(server)
              .post('/api/v1/like/announce/count/' + temp.data.other.selectedAnnounce)
              .set('Authorization', temp.data.user.token)
              .end((e, res) => {
                res.should.have.status(405)
                res.body.should.have.property('code').eql(705)
                res.body.response.should.have.property('message').eql('invalid method')
                done()
              })
          })
        })

        describe('/GET /api/v1/like/announce/count', () => {
          it('it should count 1', done => {
            chai
              .request(server)
              .get('/api/v1/like/announce/count/' + temp.data.other.selectedAnnounce)
              .set('Authorization', temp.data.user.token)
              .end((e, res) => {
                res.should.have.status(200)
                res.body.should.have.property('code').eql(201)
                res.body.response.should.have.property('message').eql('counted this announce')
                res.body.response.data.should.have.property('count').eql(1)
                done()
              })
          })
        })

        describe('/POST /api/v1/like/announce/add', () => {
          it('it will add like from user for testing duplicate like', done => {
            chai
              .request(server)
              .post('/api/v1/like/announce/add/' + temp.data.other.selectedAnnounce)
              .set('Authorization', temp.data.user.token)
              .end((e, res) => {
                res.should.have.status(200)
                res.body.should.have.property('code').eql(201)
                res.body.response.should.have.property('message').eql('you liked this announce')
                done()
              })
          })

          it('it should add like from admin', done => {
            chai
              .request(server)
              .post('/api/v1/like/announce/add/' + temp.data.other.selectedAnnounce)
              .set('Authorization', temp.data.admin.token)
              .end((e, res) => {
                res.should.have.status(200)
                res.body.should.have.property('code').eql(201)
                res.body.response.should.have.property('message').eql('you liked this announce')
                done()
              })
          })
        })

        describe('/GET /api/v1/like/announce/count', () => {
          it('it should count 2', done => {
            chai
              .request(server)
              .get('/api/v1/like/announce/count/' + temp.data.other.selectedAnnounce)
              .set('Authorization', temp.data.user.token)
              .end((e, res) => {
                res.should.have.status(200)
                res.body.should.have.property('code').eql(201)
                res.body.response.should.have.property('message').eql('counted this announce')
                res.body.response.data.should.have.property('count').eql(2)
                done()
              })
          })

          it('it should be able to handle not found event', done => {
            chai
              .request(server)
              .get(
                '/api/v1/like/announce/count/' +
                  Math.random()
                    .toString(36)
                    .substr(2),
              )
              .set('Authorization', temp.data.user.token)
              .end((e, res) => {
                res.should.have.status(404)
                res.body.should.have.property('code').eql(704)
                res.body.response.should.have.property('message').eql('announce not found')
                done()
              })
          })
        })
      })

      describe('Like/Announcement/Remove', () => {
        describe('/GET /api/v1/like/announce/remove', () => {
          it('it should not pass if user not authenticated', done => {
            chai
              .request(server)
              .get('/api/v1/like/announce/remove/' + temp.data.other.selectedAnnounce)
              .end((e, res) => {
                res.should.have.status(401)
                res.body.should.have.property('code').eql(703)
                res.body.response.should.have.property('message').eql('unauthorized')
                done()
              })
          })

          it('it should not recive GET method', done => {
            chai
              .request(server)
              .get('/api/v1/like/announce/remove/' + temp.data.other.selectedAnnounce)
              .set('Authorization', temp.data.user.token)
              .end((e, res) => {
                res.should.have.status(405)
                res.body.should.have.property('code').eql(705)
                res.body.response.should.have.property('message').eql('invalid method')
                done()
              })
          })
        })

        describe('/DELETE /api/v1/like/announce/remove', () => {
          it('it should unlike announce', done => {
            chai
              .request(server)
              .delete('/api/v1/like/announce/remove/' + temp.data.other.selectedAnnounce)
              .set('Authorization', temp.data.user.token)
              .end((e, res) => {
                res.should.have.status(200)
                res.body.should.have.property('code').eql(201)
                res.body.response.should.have.property('message').eql('you unliked this announce')
                done()
              })
          })

          it('it should be able to handle not found event', done => {
            chai
              .request(server)
              .delete(
                '/api/v1/like/announce/remove/' +
                  Math.random()
                    .toString(36)
                    .substr(2),
              )
              .set('Authorization', temp.data.user.token)
              .end((e, res) => {
                res.should.have.status(404)
                res.body.should.have.property('code').eql(704)
                res.body.response.should.have.property('message').eql('announce not found')
                done()
              })
          })
        })

        describe('/GET /api/v1/like/announce/count', () => {
          it('it should count 1', done => {
            chai
              .request(server)
              .get('/api/v1/like/announce/count/' + temp.data.other.selectedAnnounce)
              .set('Authorization', temp.data.user.token)
              .end((e, res) => {
                res.should.have.status(200)
                res.body.should.have.property('code').eql(201)
                res.body.response.should.have.property('message').eql('counted this announce')
                res.body.response.data.should.have.property('count').eql(1)
                done()
              })
          })
        })

        describe('/GET /api/v1/like/announce/islike', () => {
          it('it should return false after unlike', done => {
            chai
              .request(server)
              .get('/api/v1/like/announce/islike/' + temp.data.other.selectedAnnounce)
              .set('Authorization', temp.data.user.token)
              .end((e, res) => {
                res.should.have.status(200)
                res.body.should.have.property('code').eql(201)
                res.body.response.should.have.property('message').eql('here is the result')
                res.body.response.data.should.have.property('id').eql(temp.data.other.selectedAnnounce)
                res.body.response.data.should.have.property('isLike').eql(false)
                done()
              })
          })
        })
      })

      describe('Like/Announcement/IsLike', () => {
        it('this test has been skipped because it already tested during past tests', done => {
          done()
        })
      })
    })
  })

  after(done => {
    mongoose.connection.db.dropDatabase()
    done()
  })
})
