import { Axios } from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from"../../../_actions/user_action";

function LoginPage(props) {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onEmailHanlder = (event) => {
    setEmail(event.target.value);
  };

  const onPasswordHanlder = (event) => {
    setPassword(event.target.value);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    //email, password를 서버로 보내줌
    const body = {
      email: email,
      password: password,
    };

    dispatch(loginUser(body))
      .then(response => {
        if(response.payload.loginSuccess) {
         navigator("/");
        } else {
          alert("error");
        }
      })

    // Axios.post("/api/user/login", body)
    //   .then(response => {

    //   })
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center'
      , width: '100%', height: '100vh'
  }}>
    <form style={{ display: 'flex', flexDirection: 'column' }}
   onSubmit={onSubmitHandler}>
      <label>Email</label>
      <input type="email" value={email} onChange={onEmailHanlder} />
      <label>Password</label>
      <input type="password" value={password} onChange={onPasswordHanlder} />
      <br />
      <button>Login</button>

    </form>
  </div>
  )
}

export default LoginPage;