import express from 'express'
import passport from 'passport'

const router = express.Router()

router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  res.status(200).send({
    status: 'success',
    response: {
      data: req.user,
    },
  })
})

export default router
