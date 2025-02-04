import React from 'react'

const Register = () => {
  return (
    <div className="container" >
      <div className="form_container">
        <form action="register" method="post" className="form" id="login">
          <h1 className="form__title">Registration</h1><br/>
          <div className="form__input-group">
            <input type="text" 
            name="username" 
            id="username" maxlength="100" 
            placeholder='Enter your username'
            required/> 
          </div>
          <div className="form__input-group">
            <input type="email" 
            name="email" 
            id="username" maxlength="100" 
            placeholder='Enter Your Email'
            required/> 
          </div>
          <div className="form__input-group">
            <input type="password" 
            name="password" 
            id="pass" maxlength="100" 
            placeholder='Enter your password'
            required/> 
          </div>
          <div className="radio">
            <label htmlFor="gender">Gender : </label>
            <input type="radio" name="gender" value="female" id="female" />Female
            <input type="radio" name="gender" value="male" id="male" />Male
            <input type="radio" name="gender" value="other" id="other" />Other
            </div>

            <div className="radio">
                <label htmlFor="role">Role : </label>
                <input type="radio" name="role" value="admin" id="admin" />
                <label htmlFor="admin">Admin</label>
                <input type="radio" name="role" value="customer" id="customer" />
                <label htmlFor="customer">Customer</label>
        </div>
          <div className="address">
            <label for="username">Address </label>
            <input className="area" name="address"></input>
          </div>
          <div className="signup_btn">
            <button type="submit" className="form__button">Sign Up</button>
          </div>
       </form>
      </div>
      </div>
  )
}

export default Register
