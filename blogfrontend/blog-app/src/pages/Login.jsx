import React from "react";
import AuthForm from "../components/AuthForm";

const Login = () => {
  return (
    <div>
      <AuthForm mode="login" route='/api/token/' />
    </div>
  );
};

export default Login;
