import passport from 'passport'

export default (req, res, next) => {
  passport.authenticate('jwt', {session: false}, (err, user) => {
    if (err) {
      res.status(401).send({
        status: 'failure',
        response: {
          message: 'unexpected error',
          data: err,
        },
      })
    }
    if (user === false) {
      res.status(401).send({
        status: 'failure',
        response: {
          message: 'unauthorized',
        },
      })
    } else if (!user.activation.isActivated) {
      res.status(401).send({
        status: 'failure',
        response: {
          message: 'not activated',
          data: {
            user: {
              activation: {
                ref: user.activation.ref,
              },
            },
          },
        },
      })
    } else {
      req.user = {
        id: user._id,
        user: user.user,
      }
      next()
    }
  })(req, res, next)
}
