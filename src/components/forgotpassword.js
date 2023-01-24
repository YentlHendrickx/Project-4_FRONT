import axios from "axios";
import Q, { async } from "q";
import { useEffect, useState } from "react"
import { Navigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { Store } from 'react-notifications-component';

export default function ForgotPassword(){
    
    const [searchParams] = useSearchParams();
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

    const [submitted, setSubmitted] = useState(false)
    const [token, setToken] = useState('')


    useEffect(()=> {
        const searchToken = searchParams.get('token')
        if(searchToken != null){
            setSubmitted(true)
            setToken(searchToken)
        }
    },[])

    console.log(token)





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

    function handleSubmit(event){
        event.preventDefault();
        console.log(formData.email);
        Store.addNotification({
            title: "Email Send!",
            message: `Reset password link has been send to ${formData.email}`,
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
        sendEmail();
        
    }

    function resetPassword(event){
        event.preventDefault();
        console.log(formData.password);
        sendPassword();


    }


        const sendEmail = async () => {
            const result = await axios.post(process.env.REACT_APP_API_URL + "User/forgotpassword?email=" + formData.email);
            console.log(result)
        }

        const sendPassword = async () => {
            const newPassword = {
                newPassword: formData.password
            }
            console.log(newPassword)
            const result = await axios.post(process.env.REACT_APP_API_URL + "User/resetpassword/" + token , newPassword);
            console.log(result)
        }
        
   

    

    return(<>{!submitted?(
            <form onSubmit={handleSubmit}>
                    <input
                    className={`mt-0 mb-0 pb-0 h-16 pl-2 focus:outline-none border-[1px] border-slate-400 border-b-0`}
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                    />
                <button type='submit'>Send email</button>
            </form>)
       :(
            <form onSubmit={resetPassword}>
                <input
                  className={`mt-0 pt-0 mb-0 pb-0 h-16  pl-2 focus:outline-none border-[1px] border-slate-400`}
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  />
                  <input
                  className={`mt-0 pt-0 mb-0 pb-0 h-16  pl-2 focus:outline-none border-[1px] border-slate-400`}
                  type="password"
                  name="passwordConfirm"
                  id="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  required
                  />
            <button type='submit'>Reset Password</button>

            {Object.values(formErrors).every(x => x === undefined || x === '') === false &&
                    <div className="bg-red-400 p-2 mt-2 rounded-md text-uiLight">
                        {formErrors.password.length         > 0 && <p className="error-message">{formErrors.password}</p>}
                        {formErrors.passwordConfirm.length  > 0 && <p className="error-message">{formErrors.passwordConfirm}</p>}
                    </div>
                  }
        </form>
        
       )
       }
       <ReactNotifications />
       </>
    
    )
}