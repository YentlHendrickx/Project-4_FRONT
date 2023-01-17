import React, { useState } from "react";
import "./authform.css";

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
    passwordConfirm: ""
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
  });

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
        errors.password = value.length < 8 ? 'Password must be at least 8 characters long' : '';

        errors.passwordConfirm = value !== formData.passwordConfirm  ? 'Passwords do not match' : '';
        break;
      case 'passwordConfirm':
        errors.passwordConfirm = formData.password !== value ? 'Passwords do not match' : '';
        if (errors.passwordConfirm === '') {
          errors.passwordConfirm = value.length < 8 ? 'Password must be at least 8 characters long' : '';
        }
        break;
      default:
        break;
    }

    setFormErrors({
      email: errors.email,
      password: errors.password,
      passwordConfirm: errors.passwordConfirm
    });

    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // Handle login of user
  function handleLogin() {
    // Validate inputs
    let valid = validate();
    if (!valid) {
      return;
    }

    // Handle login with azure
  }

  // Handle registration of user
  function handleRegister() {
    // Validate inputs
    let valid = validate();

    if (!valid) {
      return;
    }

    // Handle registration with azure

  }

  function validate() {
    let valid = true;
    let errors = formErrors; 

    // When login we don't need passwordConfirm to be filled in
    if (isLogin) {
      delete errors.passwordConfirm;
    }
  
    // Check for any errors strings
    Object.values(errors).forEach(val => val.length > 0 && (valid = false));
    
    return valid;
  }

  function handleSubmit (event) {
    event.preventDefault();
    // Perform login or registration here, depending on the value of `isLogin`

    if (isLogin) {
      // Login
      handleLogin();
    } else {
      // Registration
      handleRegister();
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email" className="form-label">Email</label>
        <input
          className={`login-input ${formErrors.email.length > 0 ? "error" : ''}`}
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          required
          />
          {formErrors.email.length > 0 && <p className="error-message">{formErrors.email}</p>}

        <label htmlFor="password" className="form-label">Password</label>
        <input
          className={`login-input ${formErrors.password.length > 0 ? "error" : ''}`}
          type="password"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          required
          />
          {formErrors.password.length > 0 && <p className="error-message">{formErrors.password}</p>}

        {!isLogin && (
          <>
            <label htmlFor="passwordConfirm" className="form-label">Confirm Password</label>
            <input
              className={`login-input ${formErrors.passwordConfirm.length > 0 ? "error" : ''}`}
              type="password"
              name="passwordConfirm"
              id="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              required
              />
              {formErrors.passwordConfirm.length > 0 && <p className="error-message">{formErrors.passwordConfirm}</p>}
          </>
        )}

        <button className="login-button" type="submit">
          {isLogin ? "Login" : "Register"}
        </button>
      </form>
      <button className="login-button" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Switch to Registration" : "Switch to Login"}
      </button>
    </div>
  );
}

export default AuthForm;
