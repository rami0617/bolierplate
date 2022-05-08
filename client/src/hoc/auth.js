//아무나 진입이 가능한 페이지: landing page, about page
//로그인한 회원만 진입 가능한 페이지: detail page,
//로그인안한 회원은 진입못하는 페이지: register page, login page,
//관리자만 진입가능한 페이지: admin page,
//HOC Higher Order Component
//const EnhancedComponent = higherOrderComponent(WrappedComponent);
//higher컴포넌트에 wrapped컴포넌트를 넣으면 새로운 컴포넌트(enhanced)가 나옴

import { Axios } from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_action";

//백엔드(서버)에 request를 날려서 그 사람의 현재상태를 가져옴

export default function(SpecificComponent, option, adminRoute = null) {

  //option = null (아무나 출입이 가능한 페이지)
  //         true(로그인한 유저만 출입이 가능한 페이지)
  //         false(로그인한 유저는 출입 불가능한 페이지)

  //adminRoute => admin만 들어갈 수 있는 페이지면 true라고 지정해줌(src/App.js라우트에서)

  function AuthenticationCheck(props) {
    const dispatch = useDispatch();
    const navigator = useNavigate();

    useEffect(() => {
      dispatch(auth()).then(response => {
        console.log(response);


        //로그인하지 않은 상태
        if(!response.payload.isAuth) {
          if(option === true) {
            navigator("/login");
          }
        } else {
          //로그인한상태
          if(adminRoute && !response.payload.isAdmin) {
            navigator("/");
          } else {
            //option이 false일때
            if(option === false) {
              navigator("/");
            }
          }
        }
      })

      // Axios.get("/api/users/auth");
      //redux에 동일하게 사용함
    }, [])
    return ( <SpecificComponent />)
  }
  return AuthenticationCheck;
}