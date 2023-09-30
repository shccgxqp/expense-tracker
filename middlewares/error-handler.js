module.exports = (error, req, res, next) => {
  console.error(error)
  req.flash('error', error.errorMessage || 'Something went wrong')
  res.redirect('back')
}