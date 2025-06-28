import React from 'react'
import AuthForm from '../components/AuthForm'

function Register() {
  return (
    <div>
      <AuthForm mode="register" route='/api/user/register/' />
    </div>
  )
}

export default Register