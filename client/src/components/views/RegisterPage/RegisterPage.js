import { Axios } from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from"../../../_actions/user_action";


function RegisterPage() {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [name, setName] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");

  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });
  // const onEmailHanlder = (event) => {
  //   setEmail(event.target.value);
  // };

  // const onPasswordHanlder = (event) => {
  //   setPassword(event.target.value);
  // };


  const handleData = (event) => {
    console.log(event.target)
    const { name, value } = event.target;

   setData({
     ...data,
     [name] : value,
   })
  }

  const onSubmitHandler = (event) => {
    event.preventDefault();
    //email, password를 서버로 보내줌
    // const body = {
    //   email: email,
    //   password: data.password,
    // };

    if (data.password !== data.confirmPassword) {
      return alert("비밀번호가 일치하지 않습니다");
    }

    dispatch(registerUser(data))
      .then(response => {
        if(response.payload.success) {
          navigator("/login");
        } else {
          alert("failed to sign up");
        }
      })

   //Axios.post("/api/users/register", body)
  }


  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center'
      , width: '100%', height: '100vh'
  }}>
    <form style={{ display: 'flex', flexDirection: 'column' }}
   onSubmit={onSubmitHandler}>

      <label>Email</label>
      <input type="email" name="email"
       value={data.email} onChange={handleData} />

      <label>name</label>
      <input type="text" name="name" value={data.name} onChange={handleData} />
      <label> Password</label>
      <input type="password" name="password" value={data.password} onChange={handleData} />
      
      <label>Confirm Password</label>
      <input type="password" name="confirmPassword" value={data.confirmPassword} onChange={handleData} />
      
      <br />
      <button>회원가입</button>

    </form>
  </div>
  )
}

export default RegisterPage