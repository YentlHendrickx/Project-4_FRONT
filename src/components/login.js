import React, { useState } from "react";
import "./Login.css";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform login or registration here, depending on the value of `isLogin`
    console.log(formData);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          className="login-input"
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          className="login-input"
          type="password"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {!isLogin && (
          <>
            <label htmlFor="passwordConfirm">Confirm Password</label>
            <input
              className="login-input"
              type="password"
              name="passwordConfirm"
              id="passwordConfirm"
              onChange={handleChange}
              required
            />
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

export default Login;
