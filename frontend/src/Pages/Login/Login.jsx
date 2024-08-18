import React from 'react'
import './Login.css'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
	<>
  <div className="container">
    <div className="wrapper">
      <h2>Login</h2>
     <form>
        <div className="input-group">
          <p>Username</p>
          <input type="text" required onChange={(e)=>{
            setUsername(e.target.value)
          }}/>
        </div>
        <div className="input-group">
          <p>Password</p>
          <input type="password" id='password' name='password' required onChange={(e)=>{
            setPassword(e.target.value)
          }} />
        </div>
        <button type="submit" onClick={handleSubmit}>Login</button>
     </form>
     <div className="extras">
     <p className='back__toHome'><Link to='/'>Back</Link></p>
     <p className='forgot__password'><Link to="/forgotPassword" >Forgot Password?</Link></p>

     </div>
     <p className='new__user'>Don't have an account? <Link to="/register" className='link'>Register</Link></p>
    </div>
  </div>
  </>
  )
}

export default Login
