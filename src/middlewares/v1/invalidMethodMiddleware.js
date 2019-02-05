export default (req, res) => {
  res.status(405).send({
    status: 'failure',
    response: {
      message: 'invalid method',
    },
  })
}
