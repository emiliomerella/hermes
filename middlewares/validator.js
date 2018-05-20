module.exports = (data, next) => {
  // here is where you can validate your incoming data.
  // just pass an Error to the next callback to reject incoming request,
  // or call next() if everything is all right
  if (!data) {
    return next(new Error('malformed data'))
  }
  return next()
}
