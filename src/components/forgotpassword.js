import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";
import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { Store } from 'react-notifications-component';
import { getAuthImage } from "../authImages";
import { NavLink } from "react-router-dom";

const image = process.env.PUBLIC_URL + getAuthImage();

export default function ForgotPassword(){
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    // Forms
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        passwordConfirm: ''
    })

    const [formErrors, setFormErrors] = useState({
        email: "",
        password: "",
        passwordConfirm: "",
      });

    const [hasToken, setHasToken] = useState(false);
    const [token, setToken] = useState('');

    useEffect(()=> {
      const searchToken = searchParams.get('token')
      if(searchToken != null){
          setHasToken(true);
          setToken(searchToken);
      }
    }, [searchParams])


    // Add errors to forms
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
            errors.passwordConfirm = value !== formData.passwordConfirm  ? 'Passwords do not match' : '';
            errors.password = value.length < 8 ? 'Password must be at least 8 characters long' : '';
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
            passwordConfirm: errors.passwordConfirm,
          });
      
        setFormData({
          ...formData,
          [event.target.name]: event.target.value,
        });
    }

    function validate() {
      let valid = true;
      let errors = formErrors;

      // If from link, only validate password
      if (!hasToken) {
        delete errors.email;
      } else {
        // Validate email
        delete errors.password;
        delete errors.passwordConfirm;
      }

      // Check for errors
      Object.values(errors).forEach(err => err.length > 0 && (valid = false));

      return valid;
    }


    function handleSubmit(event){
      event.preventDefault();

      let valid = validate();
      if (!valid) return;

      sendEmail();  
    }

    function resetPassword(event){
        event.preventDefault();
        
        let valid = validate();
        if (!valid) return;

        sendPassword();
    }


    const sendEmail = async () => {
        await axios.post(process.env.REACT_APP_API_URL + "User/forgotpassword?email=" + formData.email);
        
        Store.addNotification({
          title: "Email Sent!",
          message: `Email sent to ${formData.email}.`,
          type: "success",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true,
            pauseOnHover: true
          }
        });
    }

    const sendPassword = async () => {
        const newPassword = {
            newPassword: formData.password
        }

        await axios.post(process.env.REACT_APP_API_URL + "User/resetpassword/" + token , newPassword).then(res => {
          Store.addNotification({
            title: "Password Reset Processed!",
            message: `Password was reset.`,
            type: "success",
            insert: "top",
            container: "top-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true,
              pauseOnHover: true
            }
          });
          setTimeout(() => redirectBack(false), 5000);
        }).catch(error => {
          Store.addNotification({
            title: "Error!",
            message: `${error.response.data}`,
            type: "danger",
            insert: "top",
            container: "top-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true,
              pauseOnHover: true
            }
            
          });

          setTimeout(() => redirectBack(true), 5000);
        });
    }

    function redirectBack(gotError) {
      if (gotError) {
        navigate('/forgot');
      } else {
        navigate('/login');
      }
    }

    return(
      <div className="w-screen h-screen bg-[#eee] flex">
        <ReactNotifications />
        <div className="w-[55%] h-full flex justify-center">
          <div className="mt-[15%]">
            <h3 className="text-3xl text-left font-bold">Elek3city Monitor</h3>
            {!hasToken ? (
              <>
                <p className="font-light text-slate-500 text-left max-w-[24rem]">Fill in your mail. If an account 
                with this email exists a password reset link will be sent.
                </p>
                <form className="mt-2 ml-1 flex flex-col mb-2" onSubmit={handleSubmit}>
                  
                  <div className="flex flex-row justify-between">
                    <input
                    className="mt-0 mb-0 pb-0 h-8 pl-2 focus:outline-none border-[1px] w-[80%] border-slate-400 rounded-md"
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                    />
                    <button className="mt-0 ml-2 text-white font-bold hover:bg-uiSecondaryLight bg-uiSecondary transition-colors rounded-md p-1 w-[18%]" type='submit'>Reset</button>
                  </div>
                  
                  {Object.values(formErrors).every(x => x === undefined || x === '') === false &&
                    <div className="bg-red-400 p-2 mt-2 w-[80%] rounded-md text-uiLight">
                        {formErrors.email.length         > 0 && <p>{formErrors.email}</p>}
                       
                    </div>
                  }
                </form>
                <NavLink className="mt-2 text-xl text-slate-600 hover:text-slate-400" to={'/login'} >
                  Back to Login
                </NavLink>
              </>
            ) : (
              <>
                <p className="font-light text-slate-500 text-left max-w-[24rem]">Fill in your new password. Passwords need atleast 8 characters.
                </p>
                <form className="mt-2 ml-1 w-full flex flex-col mb-2" onSubmit={resetPassword}>
                  <div className="mb-2 w-full">
                    <input
                      className="w-[80%] mt-0 pt-0 mb-0 pb-0 h-16 pl-2 focus:outline-none border-[1px] border-slate-400 rounded-t-md border-b-0"
                      type="password"
                      name="password"
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      required
                      />

                    <input
                      className="w-[80%] mt-0 pt-0 mb-0 pb-0 h-16  pl-2 focus:outline-none border-[1px] border-slate-400 rounded-b-md"
                      type="password"
                      name="passwordConfirm"
                      id="passwordConfirm"
                      value={formData.passwordConfirm}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      required
                    />
                  </div>

                  <button className="w-[80%] mt-0 text-white font-bold hover:bg-uiSecondaryLight bg-uiSecondary transition-colors rounded-md p-1" type='submit'>Reset Password</button>

                  {Object.values(formErrors).every(x => x === undefined || x === '') === false &&
                    <div className="bg-red-400 p-2 mt-2 w-[80%] rounded-md text-uiLight">
                        {formErrors.password.length         > 0 && <p>{formErrors.password}</p>}
                        {formErrors.passwordConfirm.length  > 0 && <p>{formErrors.passwordConfirm}</p>}
                    </div>
                  }
                </form>
                <NavLink className="mt-2 text-xl text-slate-600 hover:text-slate-400" to={'/login'} >
                  Back to Login
                </NavLink>
              </>   
            )}
            </div>
          </div>
          <img className="w-[45%] object-cover" src={image} alt="Elek3city"/>
       </div>
    )
}