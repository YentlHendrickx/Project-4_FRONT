// React
import { useState } from "react"

// Recoil
import { useRecoilValue } from "recoil"
import { userDataState } from "../store"

// Axios
import axios from "axios"

import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
} from "@material-tailwind/react";

// Notifications
import { ReactNotifications, Store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

export default function Profile ({ handleLogout }) {
    const userState = useRecoilValue(userDataState);
    console.warn(userState);

    // Form data
    const [emailFormData, setEmailFormData] = useState({
        oldEmail:   userState.email,
        password:   '',
        email:      '',
    });

    const [emailFormErrors, setEmailFormErrors] = useState({
        password:   '',
        email:      '',
    });

    const [passwordFormData, setPasswordFormData] = useState({
        newPasswordConfirm: '',
        newPassword:        '',
        oldPassword:        '',
        email:              ''
    });

    const [passwordFormErrors, setPasswordFormErrors] = useState({
        newPasswordConfirm: '',
        newPassword:        '',
        oldPassword:        '',
        email:              ''
    });

    const setFormErrors = (type, name, value) => {
        console.warn(type, name, value);
        let errors = emailFormErrors;

        if (type === 'password') {
            errors = passwordFormErrors;
        }

        // Add errors when needed
        switch (name) {
          case 'email':
            // Regex for email validation
            errors.email = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)
            ? ''
            : 'Invalid email address';
            break;

          case 'oldPassword':
          case 'newPassword':
          case 'password':
            let passwordError = value.length < 8 ? 'Password must be at least 8 characters long' : '';
            if (name === 'password') {
                errors.password = passwordError;
            } else {
                if (name === 'oldPassword') {
                    errors.oldPassword = passwordError;
                } else {
                    if (passwordError === "") {
                        errors.newPasswordConfirm = passwordFormData.newPasswordConfirm !== value ? 'Passwords do not match' : '';
                    }
    
                    errors.newPassword = passwordError;
                }
            }
            break;

          case 'newPasswordConfirm':
            errors.newPasswordConfirm = passwordFormData.newPassword !== value ? 'Passwords do not match' : '';

            if (errors.newPasswordConfirm === '') {
              errors.newPasswordConfirm = value.length < 8 ? 'Password must be at least 8 characters long' : '';
            }
            break;

          default:
            break;
        }
    
        if (type === 'password') {
            setPasswordFormErrors({
                email: errors.email,
                oldPassword: errors.oldPassword,
                newPassword: errors.newPassword,
                newPasswordConfirm: errors.newPasswordConfirm,
            });
        } else {
            setEmailFormErrors({
                email: errors.email,
                password: errors.password,
            });
        }
    }
    
    // Validate the forms
    function validate(type) {
        let valid = true;
        
        let errors = emailFormErrors;

        if (type === 'password') {
            errors = passwordFormErrors; 
        }
        
        // Check for any errors strings
        Object.values(errors).forEach(val => val.length > 0 && (valid = false));
        
        return valid;
    }

    async function handleChangeEmail(event) {
        event.preventDefault();

        if (!validate('email')) {
            return;
        }

        const newEmail = {
            oldEmail: userState.email,
            newEmail: emailFormData.newEmail,
            password: emailFormData.password,
        }

        await axios.put(process.env.REACT_APP_API_URL + 'User/changeemail/', newEmail)
        .error(err => {
            console.warn(err)
        });

        Store.addNotification({
            title: "Email Sent!",
            message: `Email sent to\n${emailFormData.newEmail}.`,
            type: "success",
            insert: "center",
            container: "top-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
                duration: 5000,
                onScreen: true,
                pauseOnHover: true
            }
        });

        setTimeout(() => handleLogout(), 5000);
    }

    // Handle password change
    async function handleChangePassword(event) {
        event.preventDefault();

        if (!validate('password')) {
            return;
        }

        const newPassword = {
            newPassword: passwordFormData.newPassword,
            oldPassword: passwordFormData.oldPassword,
            email: passwordFormData.email
        }

        await axios.post(process.env.REACT_APP_API_URL + 'User/changepassword/', newPassword)
        .error(err => {
            console.warn(err);
        });

        Store.addNotification ({
            title: "Password Changed!",
            message: `Password has been changed.`,
            type: "success",
            insert: "top",
            container: "top-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
                duration: 5000,
                onScreen: true,
            }
        });     
            
        setTimeout(() => handleLogout(), 5000);
    }

    function onChangeEmail(event) {
        setEmailFormData ({
            ...emailFormData,
            [event.target.name]: event.target.value
        });

        setFormErrors('email', event.target.name, event.target.value);
    }

    function onChangePassword (event) {
        setPasswordFormData({
            ...passwordFormData,
            [event.target.name]: event.target.value
        });

        setFormErrors('password', event.target.name, event.target.value);
    }

    return (
        <div className="w-screen h-screen">
            <ReactNotifications className="!relative"/>
            <div className="w-full h-full flex flex-col items-center mt-4">

                <p className="text-4xl">{userState.firstName} {userState.lastName}</p>
                <p className="text-xl font-light italic">{userState.email}</p>

                <div className="w-full flex flex-col">
                    <div className="mt-6">
                        <p className="text-xl text-center">Change email</p>
                        <form className="flex flex-col mx-2 items-center mt-2 gap-4"  onSubmit={handleChangeEmail}>
                            <input className="pl-2 w-[40%]" type='email' name={"email"} placeholder={"New email"} value={emailFormData.email} onChange={onChangeEmail}/>
                            <input className="pl-2 w-[40%]" type='password' name={"password"} placeholder={"Current password"} value={emailFormData.password} onChange={onChangeEmail}/>
                            <button className="bg-save hover:bg-saveHover text-uiLight rounded-md w-[80%] md:w-[20%] " type="submit">Change email</button>
                        </form>
                    </div>

                    <div className="mt-6">
                        <p className="text-xl text-center">Change password</p>
                        <form className="flex flex-col mx-2 items-center mt-2 gap-4"  onSubmit={handleChangePassword}>
                            <input className="pl-2 w-[40%]" type='email' name={"email"}placeholder={"Email"} value={passwordFormData.email} onChange={onChangePassword}/>
                            <input className="pl-2 w-[40%]" type='password' name={"oldPassword"} placeholder={"Current password"} value={passwordFormData.oldPassword} onChange={onChangePassword}/>
                            <input className="pl-2 w-[40%]" type='password' name={"newPassword"} placeholder={"New password"} value={passwordFormData.newPassword} onChange={onChangePassword}/>
                            <input className="pl-2 w-[40%]" type='password' name={"newPasswordConfirm"} placeholder={"Confirm password"} value={passwordFormData.newPasswordConfirm} onChange={onChangePassword}/>
                            <button className="bg-save hover:bg-saveHover text-uiLight rounded-md w-[80%] md:w-[20%]" type="submit">Change password</button>
                        </form>
                    </div>
                </div>
        </div>
        </div>      
    );
}