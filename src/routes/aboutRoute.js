import express from 'express'
import latestCommit from 'repo-latest-commit'
import moment from 'moment'

const router = express.Router()

router.get('/', (req, res) => {
  const latest = latestCommit()
  res.status(200).send({
    status: 'success',
    code: 201,
    response: {
      message: 'M-NET API Server',
      data: {
        repository: 'https://github.com/rayriffy/mnet-api.git',
        server: {
          version: latest.commit,
          date: moment(latest.date).toISOString(),
        },
        api: {
          stable: {
            uri: '/api/v1',
            desc: 'API V1',
          },
          latest: {
            uri: '/api/v1',
            desc: 'API V1',
          },
        },
      },
    },
  })
})

router.all('/', (req, res) => {
  res.status(405).send({
    status: 'failure',
    code: 705,
    response: {
      message: 'invalid method',
    },
  })
})

export default router
