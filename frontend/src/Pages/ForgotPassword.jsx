import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import wallpaper from '../Assets/formWall.png'
import { Link } from 'react-router-dom'
import UserContext from '../utils/CreateContext'

const ForgotPassword = () => {

  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [serverError, setServerError] = useState('')
  const navigate = useNavigate()
  const { token } = useContext(UserContext)


  useEffect(() => {
    if (token) navigate('/')  
}, [token])

  const validateEmail = () => {
    const emailRegex = /^\S+@\S+\.\S+$/
    if (!email) return 'Email is required'
    if (!emailRegex.test(email)) return 'Invalid email format'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const emailValidation = validateEmail()
    setEmailError(emailValidation)
    if (emailValidation) return
    try {
      const response = await axios.post('http://localhost:5000/api/user/forgotpassword', { email })
      if (response.status === 200) {
        navigate(`/ForgotPasswordverification/${response.data.token}`)
      }
    } catch (error) {
      if (error.response) {
        setServerError(error.response.data.message)
      } else {
        setServerError('An error occurred. Please try again later.')
      }
    }
  }


  return (
    <div
      className="flex flex-col justify-center items-center min-h-[calc(100vh-120px)] bg-cover bg-center"
      style={{
        backgroundImage: `url(${wallpaper})`,
      }}
    >
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg mt-7 md:mt-20 mb-10">
        <h2 className="text-2xl font-semibold text-center mb-6">Forgot Password</h2>
        {serverError && (
          <p className="text-red-500 text-center mb-4">{serverError}</p>
        )}
        <form className="flex flex-col" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-3 py-2 border rounded-md"
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gray-800 text-white font-semibold rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Reset
          </button>
        </form>
        <p className="text-center mt-6 text-sm">
          Don't have a reason to be here?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:underline"
          >
            Go Back
          </Link>
        </p>
      </div>
    </div>
  );
  
}

export default ForgotPassword