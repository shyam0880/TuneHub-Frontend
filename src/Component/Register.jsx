import React, {useState, useEffect} from 'react';


const Register = () => {
  const [messageStatus,setMessageStatus] = useState(false);
  const [passwordFeedback,setPasswordFeedback] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    digit: false,
    specialChar: false
  });
  const [message,setMessage] = useState("");
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    gender: '',
    role: '',
    address: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

  if (name === 'password') {
    if(value===""){
      setMessageStatus(false);
    } else{
      setMessageStatus(true);
    } 
    setPasswordFeedback({
      length: value.length >= 6,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      digit: /\d/.test(value),
      specialChar: /[@$!%*?&]/.test(value)
    });
  }

  setUser({ ...user, [name]: value });
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });
      const textResponse = await response.text();
      if(!response.ok){
        setMessage(textResponse);
      }
      setMessageStatus(true);
      setMessage(textResponse);
      setUser({
        username: '',
        email: '',
        password: '',
        gender: '',
        role: '',
        address: ''
      });
 

    }
    catch(e){
      setMessage("Something went wrong!");
    }
  }

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(""),
        setMessageStatus(false);
      }, 3000);
      return () => clearTimeout(timer); // Cleanup function
    }
  }, [message]);
  


  return (
    <div className="container" >
      <div className="form_container">
        <form action="register" className="form" id="login" onSubmit={handleSubmit}>
          <h1 className="form__title">Registration</h1><br/>
          <div className="form__input-group">
            <input type="text" 
            name="username" 
            id="username" maxLength="100" 
            value={user.username}
            onChange={handleChange}
            placeholder='Enter your username'
            required/> 
          </div>
          <div className="form__input-group">
            <input type="email" 
            name="email" 
            id="username" maxLength="100" 
            value={user.email}
            onChange={handleChange}
            placeholder='Enter Your Email'
            required/> 
          </div>
          <div className="form__input-group">
            <input type="password" 
            name="password" 
            id="pass" maxLength="100" 
            value={user.password}
            onChange={handleChange}
            placeholder='Enter your password'
            required/> 
          </div>
          <div className="radio">
            <label for="gender">Gender : </label>
            <input type="radio" name="gender" value="female" id="female" 
            checked={user.gender === "female"}
            onChange={handleChange}
            />Female
            <input type="radio" name="gender" value="male" id="male"
             checked={user.gender === "male"}
             onChange={handleChange}
            />Male
            <input type="radio" name="gender" value="other" id="other" 
             checked={user.gender === "other"}
             onChange={handleChange}
            />Other
          </div>

          <div className="radio">
            <label for="role">Role : </label>
            <input type="radio" name="role" value="admin" id="admin" 
            checked={user.role === "admin"}
            onChange={handleChange}
            />
            <label for="admin">Admin</label>
            <input type="radio" name="role" value="customer" id="customer"
            checked={user.role === "customer"}
            onChange={handleChange}
            />
            <label for="customer">User</label>
          </div>
          <div className="address">
            <label for="username">Address </label>
            <input className="area" name="address"
            value={user.address}
            onChange={handleChange}
            ></input>
          </div>
          <div className="signup_btn">
            <button type="submit" className="form__button">Sign Up</button>
          </div>
       </form>
       {messageStatus && <p style={{color:messageStatus?"Green":"red"}}>{message}</p>}
       {messageStatus && <>
        <p style={{color:passwordFeedback.length?"Green":"red"}}>Minimum 6 characters</p>
        <p style={{color:passwordFeedback.uppercase?"Green":"red"}}>At least 1 uppercase letter</p>
        <p style={{color:passwordFeedback.lowercase?"Green":"red"}}>At least 1 lowercase letter</p>
        <p style={{color:passwordFeedback.digit?"Green":"red"}}>At least 1 number</p>
        <p style={{color:passwordFeedback.specialChar?"Green":"red"}}>At least 1 special character</p>
       </>
       }
      </div>
      </div>
  )
}

export default Register
