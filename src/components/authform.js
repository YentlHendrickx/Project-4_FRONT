import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from 'axios';

// Recoil
import { useRecoilState } from "recoil";
import { initialsState } from "../store";
import { userDataState } from "../store";

import { getAuthImage } from "../authImages";
import { async } from "q";

function AuthForm({ forLogin, setIsLoggedIn, isLoggedIn }) {
  const navigate = useNavigate();

  // Set initials
  const [initials, setInitials] = useRecoilState(initialsState)
  const [userData, setUserData] = useRecoilState(userDataState);
  
  const [image, setImage] = useState(process.env.PUBLIC_URL + getAuthImage());

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    firstName: "",
    lastName: "",
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    firstName: "",
    lastName: "",
  });

  function switchLoginRegister(event) {
    event.preventDefault();
    if (forLogin) {
      navigate('/register');
    } else {
      let errors = formErrors;
      errors.passwordConfirm = "";
      errors.firstName = "";
      errors.lastName = "";

      setFormErrors(errors);
      navigate('/login');
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    let errors = formErrors;

    // Add errors when needed
    switch (name) {
      case 'email':
        // Regex for email validation
        errors.email = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)
        ? ''
        : 'Invalid email address';
        break;
      case 'password':

        if (!forLogin) {
          errors.passwordConfirm = value !== formData.passwordConfirm  ? 'Passwords do not match' : '';
        }

        errors.password = value.length < 8 ? 'Password must be at least 8 characters long' : '';
        break;
      case 'passwordConfirm':
        errors.passwordConfirm = formData.password !== value ? 'Passwords do not match' : '';
        if (errors.passwordConfirm === '') {
          errors.passwordConfirm = value.length < 8 ? 'Password must be at least 8 characters long' : '';
        }
        break;
      case 'firstName':
        errors.firstName = value.length === 0 ? 'First name is required' : '';
        break;
      case 'lastName':
        errors.lastName = value.length === 0 ? 'Last name is required' : '';
        break;
      default:
        break;
    }

    setFormErrors({
      email: errors.email,
      password: errors.password,
      passwordConfirm: errors.passwordConfirm,
      firstName: errors.firstName,
      lastName: errors.lastName,
    });

    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  function validate() {
    let valid = true;
    let errors = formErrors; 

    // When login we don't need passwordConfirm, firstname or lastname
    if (forLogin) {
      delete errors.passwordConfirm;
      delete errors.firstName;
      delete errors.lastName;
    }
  
    // Check for any errors strings
    Object.values(errors).forEach(val => val.length > 0 && (valid = false));
    
    return valid;
  }

  // Handle login of user
  async function handleLogin() {
    // Validate inputs
    let valid = validate();
    if (!valid) {
      return;
    }

    // Handle login with azure

    const { email, password } =  formData;

    axios.post(process.env.REACT_APP_API_URL + 'User/login', {email, password})
      .then(res => {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('isLoggedIn', true);

        const uInitials = res.data.userDto.firstName.charAt(0) + res.data.userDto.lastName.charAt(0);
        setInitials(uInitials);

        const userDataDto = {
          firstName: res.data.userDto.firstName,
          lastName: res.data.userDto.lastName,
          userId: res.data.userDto.id
        }
        setUserData(userDataDto);

        localStorage.setItem('userDataState', JSON.stringify(userDataDto));
        localStorage.setItem('initialsState', JSON.stringify(uInitials));

        setIsLoggedIn(true);
        navigate('/');
      }).catch(err => {
        setFormErrors({...formErrors, login: 'Invalid email or password'});
      });
  }

  // Handle registration of user
  async function handleRegister() {
    // Validate inputs
    let valid = validate();

    if (!valid) {
      return;
    }

    const { email, password, firstName, lastName } =  formData;

    // Handle registration with azure
    axios.post(process.env.REACT_APP_API_URL + 'User', {email, password, firstName, lastName})
      .then(res => {
        navigate('/login');
      }).catch(err => {
        setFormErrors({...formErrors, login: 'Invalid email or password'});
      });
  }

  function handleSubmit (event) {
    event.preventDefault();

    // Perform login or registration here, depending on the value of `isLogin`
    if (forLogin) {
      // Login
      handleLogin();
    } else {
      // Registration
      handleRegister();
    }
  };

  return (
    <div className="w-screen h-screen bg-[#eee] flex">
      <div className="w-[55%] h-full flex justify-center">
          <div className="mt-[15%]">
            <h3 className="text-3xl text-left font-bold">Elek3city Monitor</h3>
            <p className="font-light text-slate-500 text-left max-w-[24rem]">Want to monitor your electricity usage? You've come to the right place.</p>
            <form className="" onSubmit={handleSubmit}>
              <div className="flex flex-col max-w-[24rem] mt-2 ml-1 relative">
                {!forLogin && (
                    <>
                        <input
                          className="mt-0 mb-0 pb-0 pl-2 rounded-t-md h-16 border-[1px] border-slate-400 border-b-0 focus:outline-none"
                          type="text"
                          name="firstName"
                          id="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="First Name"
                          required
                          />

                        <input
                          className="mt-0 mb-0 pb-0 pl-2 h-16 border-[1px] border-slate-400 border-b-0 focus:outline-none"
                          type="text"
                          name="lastName"
                          id="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Last Name"
                          required
                          />
                    </>
                  )}

                <input
                  className={`mt-0 mb-0 pb-0 h-16 pl-2 focus:outline-none border-[1px] border-slate-400 border-b-0 ${forLogin ? 'rounded-t-md' : ''}`}
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  />

                <input
                  className={`mt-0 pt-0 mb-0 pb-0 h-16  pl-2 focus:outline-none border-[1px] border-slate-400 ${forLogin ? 'rounded-b-md' : 'border-b-0'}`}
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  />

                  {forLogin && (         
                    <button className="underline font-light text-slate-500 hover:text-slate-300 text-right">Forgot Password</button>
                  )}

                  {!forLogin && (
                    <>
                      <input
                        className="mt-0 pt-0 pb-0 pl-2 rounded-b-md border-[1px] border-slate-400 h-16 focus:outline-none"
                        type="password"
                        name="passwordConfirm"
                        id="passwordConfirm"
                        value={formData.passwordConfirm}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        required
                        />
                    </>
                  )}

                  <div>
                    <span className="text-slate-500">{forLogin ? "Don't have an account? " : "Already have an account? "}<button onClick={(event) => switchLoginRegister(event)} 
                      className="text-blue-400 hover:text-blue-500">{forLogin ? "Sign Up" : "Sign In"}</button></span>
                  </div>

                  
                  {Object.values(formErrors).every(x => x === undefined || x === '') === false &&
                    <div className="bg-red-400 p-2 mt-2 rounded-md text-uiLight">
                        {formErrors.email.length > 0 && <p className="error-message">{formErrors.email}</p>}
                        {formErrors.password.length         > 0 && <p className="error-message">{formErrors.password}</p>}
                      {!forLogin && <>
                        {formErrors.firstName.length        > 0 && <p className="error-message">{formErrors.firstName}</p>}
                        {formErrors.lastName.length         > 0 && <p className="error-message">{formErrors.lastName}</p>}
                        {formErrors.passwordConfirm.length  > 0 && <p className="error-message">{formErrors.passwordConfirm}</p>}
                      </>}
                      
                        {formErrors.login !== undefined && 
                        <>
                          {formErrors.login ? <div className="bg-red-500 text-white p-3 rounded-lg">{formErrors.login}</div> : null}
                        </>
                      }
                    </div>
                  }


                  <button className="mt-4 text-white font-bold hover:bg-uiSecondaryLight bg-uiSecondary transition-colors rounded-md py-2" type="submit">
                    {forLogin ? "Log In" : "Register"}
                  </button>
              </div>
            </form>
          </div>
      </div>
      <img className="w-[45%] object-cover" src={image} alt="Electricity"/> 
    </div>
  );
}

export default AuthForm;
