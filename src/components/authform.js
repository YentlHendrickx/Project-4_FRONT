import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from 'axios';

// Recoil
import { useSetRecoilState } from "recoil";
import { initialsState } from "../store";
import { userDataState } from "../store";

import { getAuthImage } from "../authImages";

const image = process.env.PUBLIC_URL + getAuthImage();

function AuthForm({ forLogin, setIsLoggedIn, isLoggedIn }) {
  const navigate = useNavigate();

  // Set initials
  const setInitials = useSetRecoilState(initialsState)
  const setUserData = useSetRecoilState(userDataState);

  const [verificationRequired, setVerificationRequired] = useState(false);
  // const [setVer]
  const [showVerifyForm, setShowVerifyForm] = useState(false);
  

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

  const [verifyForm, setVerifyForm] = useState({
    email: "",
  });

  const [verifyFormErrors, setVerifyFormErrors] = useState({
    email: "",
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

    if (name === 'verifyEmail') {
      errors = verifyFormErrors;
    }

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
      case 'verifyEmail':
        errors.verifyEmail = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)
        ? ''
        : 'Invalid email address';
        break;
      default:
        break;
    }

    if (name === 'verifyEmail') {
      setVerifyFormErrors({
        email: errors.verifyEmail,
      });

      setVerifyForm({
        email: event.target.value
      });
    } else {
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
          userId: res.data.userDto.id,
          email: res.data.userDto.email
        }
        setUserData(userDataDto);

        localStorage.setItem('userDataState', JSON.stringify(userDataDto));
        localStorage.setItem('initialsState', JSON.stringify(uInitials));

        setIsLoggedIn(true);
        navigate('/');
      }).catch(err => {
          if(err.response.data === "Email not verified.") {
            setVerificationRequired(true);
          } else {
            setFormErrors({...formErrors, login: 'Invalid email or password'});
          }
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
        // Require verification
        setVerificationRequired(true);
        // navigate('/login');
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
  }

  function backToLogin() {
    setShowVerifyForm(false);
    setVerificationRequired(false);

    setVerifyForm(({
      email: "",
    }));

    setVerifyFormErrors({
      email: ""
    });
      
    navigate('/login');
  }

  function sendVerification(event) {
    event.preventDefault();

    sendVerifyMail();
  }

  async function sendVerifyMail() {
    await axios.post(process.env.REACT_APP_API_URL + "User/verify?email=" + verifyForm.email);
  }

  return (
    <div className="w-screen h-screen bg-[#eee] flex">
      <div className="w-[55%] h-full flex justify-center">
        <div className="mt-[15%]">
          <h3 className="text-3xl text-left font-bold">Elek3city Monitor</h3>

          {verificationRequired ? (
              <>
                {showVerifyForm ? (
                  <>
                    <p className="font-light text-slate-500 text-left max-w-[24rem]">Fill in your mail address. 
                    If an account with this email exists a new verification mail will be sent.</p>
                    <form className="mt-2 ml-1 flex justify-between" onSubmit={sendVerification}>
                      <input
                        className={`mt-0 mb-0 pb-0 h-8 pl-2 focus:outline-none border-[1px] w-[80%] border-slate-400 rounded-md`}
                        type="email"
                        name="verifyEmail"
                        id="verifyEmail"
                        value={verifyForm.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                      />

                      <button className="mt-0 ml-2 text-white font-bold hover:bg-uiSecondaryLight bg-uiSecondary transition-colors rounded-md p-1" type="submit">
                        Verify
                      </button>
                    </form>
                    {verifyFormErrors.email.length > 0 && (
                      <div className="bg-red-400 p-2 mt-2 ml-1 rounded-md text-uiLight">
                        <p className="error-message">{verifyFormErrors.email}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <p className="font-light text-slate-500 text-left max-w-[24rem]">You need to verify your email address. Didn't&nbsp;get&nbsp;an&nbsp;email?&nbsp;
                    <button onClick={() => setShowVerifyForm(true)} className="font-medium underline">Click&nbsp;Here</button></p>
                  </>
                )}
                  <button className="mt-3 ml-1 text-2xl text-slate-600 hover:text-slate-400" onClick={() => backToLogin()}>
                      Back to Login
                  </button>
              </>
          ) : (
            <>
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
                      <button onClick={(event) => {
                        event.preventDefault();
                        navigate('/forgot')
                      }} className="underline font-light text-slate-500 hover:text-slate-300 text-right">Forgot Password</button>
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
                          {formErrors.password.length         > 0 && <p>{formErrors.password}</p>}
                        {!forLogin && <>
                          {formErrors.firstName.length        > 0 && <p>{formErrors.firstName}</p>}
                          {formErrors.lastName.length         > 0 && <p>{formErrors.lastName}</p>}
                          {formErrors.passwordConfirm.length  > 0 && <p>{formErrors.passwordConfirm}</p>}
                        </>}
                        
                          {formErrors.login !== undefined && 
                          <>
                            {formErrors.login.length > 0 && <p>{formErrors.login}</p>}
                          </>
                        }
                      </div>
                    }
  
  
                    <button className="mt-4 text-white font-bold hover:bg-uiSecondaryLight bg-uiSecondary transition-colors rounded-md py-2" type="submit">
                      {forLogin ? "Log In" : "Register"}
                    </button>
                </div>
              </form>
            </>
            )}
          </div>
      </div>
      <img className="w-[45%] object-cover" src={image} alt="Elek3city"/> 
    </div>
  );
}

export default AuthForm;
