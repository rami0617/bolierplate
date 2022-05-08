const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { decode } = require("jsonwebtoken");

const saltRounds = 10;


const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 1,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  }
});

//user모델에 user정보를 저장하기 전에
userSchema.pre("save", function(next) {
  const user = this; //user를 가리킴
 //비밀번호를 암호화시킨다.
  //1.saltRounds => salt가 몇 글자인지 나타냄
  //2.salt를 생성하고 salt를 이용해서 비밀번호를 암호화해야함.
  //3.사용자가 입력한 비밀번호 => 해시로 바꿔 저장함
  if(user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if(err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if(err) return next(err);
        user.password = hash; //hash된 비밀번호로 바꿔줌
        next();
      })
    })
  } else {
    next();
  }
})


userSchema.methods.comparePassword = function (plainPassword, callback) {
  //plainPassword 1234567
  //암호화된 비밀번호  ... 가 같은지 체크해야함
  let user = this;
  bcrypt.compare(plainPassword, user.password, function (err, isMatch) {
    // console.log(user.password) hash된 비밀번호값이 들어옴
    if(err) {
      return callback(err);
    }
   return callback(null, isMatch);
  })
}

userSchema.methods.generateToken = function (callback) {
  const user = this;
  //jsonwebtoken을 이용해서 token생성하기
  //user._id는 objectId
  const token = jwt.sign(user._id.toHexString(), 'secretToken');

  //나중에 secretToken을 넣게되면 id를 알 수 있음(복호화)

  user.token = token;
  user.save(function (err, user) {
    if(err) return callback(err);
    callback(null, user);
  })
}




userSchema.statics.findByToken = function (token, callback) {
  const user = this;



  //토큰을 decode(복호화)한다
  jwt.verify(token, "secretToken", function(err, decoded) {
//decode된건 userid
//userid를 이용해서 user를 찾은 다음에
//클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인


  user.findOne({"_id" : decoded, "token": token}, function (err, user) {
    if(err) return callback(err);
    callback(null, user);
  })
  })
}

const User = mongoose.model("User", userSchema);

module.exports = { User };
