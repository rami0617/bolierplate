const { User } = require("../models/Users");

let auth = (req, res, next) => {
  //인증처리를 하는곳
  //클라이언트 쿠키에서 토큰을 가져옴

  const token = req.cookies.x_auth;

  //decode(복호화)한 후 유저를 찾는다.

  User.findByToken(token, (err, user) => {
      if(err) throw err;
      if(!user) return res.json({ isAuth: false, error: true });

      req.token = token;
      req.user = user;
      next();//미들웨어에서 넘어가려면 next를 해줘야함
  })

  //유저가 있으면 인증 성공

  //없으면 인증실패

};


module.exports = { auth };