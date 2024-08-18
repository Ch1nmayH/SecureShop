import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

const Register = () => {
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [cpassword, setCPassword] = useState('')
  
	const handleSubmit = (e) => {
	  e.preventDefault()
	}
  
	return (
	  <>
	<div className="container">
	  <div className="wrapper">
		<h2>Register</h2>
	   <form>
		  <div className="input-group">
			<p>First Name</p>
			<input type="text" id="fname" name="fname" required onChange={(e)=>{
			  setFirstName(e.target.value)
			}}/>
		  </div>
		  <div className="input-group">
			<p>Last Name</p>
			<input type="text" id="lname" name="lname" required onChange={(e)=>{
			  setLastName(e.target.value)
			}}/>
		  </div>
		  <div className="input-group">
			<p>Email</p>
			<input type="email" id="email" name="email" required onChange={(e)=>{
			  setEmail(e.target.value)
			}}/>
		  </div>
		  <div className="input-group">
			<p>Password</p>
			<input type="password" id='password' name='password' required onChange={(e)=>{
			  setPassword(e.target.value)
			}} />
		  </div>
		  <div className="input-group">
			<p>Confirm Password</p>
			<input type="password" id='cpassword' name='cpassword' required onChange={(e)=>{
			  setCPassword(e.target.value)
			}} />
		  </div>
		  <button type="submit" onClick={handleSubmit}>Register</button>
	   </form>
	   <p className='back__toHome'><Link to='/'>Go back to Homepage?</Link></p>
	   <p className='new__user'>Already have an account? <Link to="/login" className='link'>Login</Link></p>
	  </div>
	</div>
	</>
	)
  }
export default Register;
