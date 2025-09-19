
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next(); // user logged in, continue
  } else {
    res.status(401).send(`<script>alert('Please log in first'); window.location.href='/login';</script>`);
  }
}


function isUser(req, res, next) {
  if (req.session.user && req.session.user.role === 'user') {
    next();
  } else {
    // if AJAX or API request expecting JSON
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(401).json({ error: "Please log in first" });
    }
    // else normal page request
    res.status(401).send(`<script>alert('Please log in first'); window.location.href="/login";</script>`);
  }
}


function isAdmin(req,res,next){
    if(req.session.user && req.session.user.role ==='admin'){
        next();
    }else{
        res.status(403).send(`<script>alert('Access denied.Admins only.'); window.location.href="/login";</script>`);
    }
}

module.exports=
{
    isAuthenticated,
    isUser,
    isAdmin
};
