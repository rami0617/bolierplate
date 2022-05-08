const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const config = require("./config/key");
const { User } = require("./models/Users");
const { auth }  =require("./middleware/auth");


//application/x-www-form-urlendcoded
app.use(bodyParser.urlencoded({ extended: true }));

//application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require("mongoose");

mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
}).then(() => console.log("🍊mongodb Connected"))
  .catch((err) => console.log(err));


app.get("/", (req, res) => {
    res.send("Hello world");
});


app.get('/api/hello', (req, res) => res.send('Hello World!~~ '))
app.post("/api/users/register", (req, res) => {
  //회원가입할 때 필요한 정보들을 client에서 가져오면 그것들을 데이터베이스에 넣어준다.
  const user = new User(req.body);
  user.save((err, doc) => {
    if(err) return res.json({success: false, err});
    return res.status(200).json({
      success: true,
    })
  })
})

app.post("/api/users/login", (req, res) => {
  //요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({
    email : req.body.email,
  }, (err, user) => {
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "Invalid user",
      });
    }
    //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인.
    //userModel에서 comparePassword를 만들어줌
   user.comparePassword(req.body.password, (err, isMatch) => {
    if (!isMatch) {
      return res.json({ loginSuccess: false, message: "wrong password"});
    }
  //비밀번호까지 맞다면 토큰을 생성함.
  //generateToken을 UserModel에서 만듦.
    user.generateToken((err, user) => {
     if(err) return res.status(400).send(err);

      //토큰을 저장한다. 어디에? 쿠키, 로컬스토리지
      //쿠키파서를 깔아야함
      res.cookie("x_auth", user.token)
         .status(200)
         .json({ loginSuccess: true, userId: user._id });
    })
   })
  })
})




//authentication
//1.cookie에 저장되 token을 server에서 가져와서 복호화를 한다.
//2.복호화를 하면 user id가 나오는데 그 user id를 이용해서 데이터 베이스 user collection에서 user를
//찾은 후 쿠키에서 받아온 token을 user도 가지고 있는지 확인
//쿠키가 일치하면
//쿠키가 일치하지 않으면 authentication false
app.get("/api/users/auth", auth, (req, res) => {
  //미들웨어를 통과하여 여기까지 왔다는 것은 Authentication이 true라는 말
  res.status(200).json({
    //user정보제공
    _id: req.user._id,
    //role 0 : 일반유저, 아니면 관리자
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  })
});

//logout
//로그아웃하려는 유저를 데이터베이스에서 찾아서 그 유저의 토큰을 지워준다

app.get("/api/users/logout", auth, (req, res) => {
  console.log(req.user)
  User.findOneAndUpdate({_id: req.user._id},
    {token : ""},
    (err, user) => {
      if(err) return res.json({success: false, err});
      return res.status(200).send({
        success: true,
      })
    })
})




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});