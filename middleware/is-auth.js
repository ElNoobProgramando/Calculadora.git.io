module.exports = (req, res, next) => {
    if (req.session.isAuth) {
      next();
    }
    if(!req.session.isAuth){
        next();
    }
  };