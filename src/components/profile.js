import { Email } from "@mui/icons-material"
import axios from "axios"
import { useState } from "react"
import { useRecoilValue } from "recoil"
import { userDataState } from "../store"

import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { Store } from 'react-notifications-component';

export default function Profile({handleLogout}){
    const [changeEmail, setChangeEmail] = useState(false)
    const [changePassword, setChangePassword] = useState(false)
    const [emailFormData, setEmailFormData] = useState({
        oldEmail: '',
        email: '',
        password: ''
    })
    const [passwordFormData, setPasswordFormData] = useState({
        newPassword: '',
        oldPassword: '',
        email: ''
    })
    const userState = useRecoilValue(userDataState);


    async function handleChangeEmail(event){
        event.preventDefault();
        // setChangeEmail(true)
        // setChangePassword(false)
        if(event){
            const newEmail = {
                newEmail: emailFormData.newEmail,
                oldEmail: userState.email,
                password: emailFormData.password
            }
            console.log(process.env.REACT_APP_API_URL + 'User/changeemail', newEmail);
            const result =  await axios.put(process.env.REACT_APP_API_URL + 'User/changeemail/', newEmail);
            console.log(result)
            console.log(newEmail)

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
    }

    async function handleChangePassword(event){
        event.preventDefault();
        // setChangeEmail(false)
        // setChangePassword(true)
        if(event){
            const newPassword = {
                newPassword: passwordFormData.newPassword,
                oldPassword: passwordFormData.oldPassword,
                email: passwordFormData.email
            }
            console.log(newPassword)
            console.log(process.env.REACT_APP_API_URL + 'User/changepassword/', newPassword)
            const result = await axios.post(process.env.REACT_APP_API_URL + 'User/changepassword/', newPassword)
            console.log(result)
            console.log(newPassword)

            Store.addNotification({
                title: "Password Changed!",
                message: `Password has been changed`,
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
    }

    function onChangeEmail(event){
        setEmailFormData({
            ...emailFormData,
            [event.target.name]: event.target.value
        })
        console.log(emailFormData)
    }
    function onChangePassword(event){
        setPasswordFormData({
            ...passwordFormData,
            [event.target.name]: event.target.value
        })
        console.log(passwordFormData)
    }


    return(<div>
        <ReactNotifications/>
                { !changeEmail && !changePassword?(
                <div className=" flex justify-center gap-8 m-[6vh]">
                    <button className=" bg-green-500 rounded-lg text-uiLight w-[50rem]" onClick={()=> setChangeEmail(!changeEmail)}>Change email</button>
                    <button className=" bg-uiPrimary rounded-lg text-uiLight w-[50rem]" onClick={()=> setChangePassword(!changePassword)}>change password</button>
                </div>
                ):(<>
                    { changeEmail ? (

                        <div className="grid grid-cols-1 gap-3 w-[50%] mx-auto">
                            
                            <h1 className="text-4xl text-center">Change email</h1>

                            <form className=" grid grid-cols-4 gap-3 mx-[8vh]"  onSubmit={handleChangeEmail}>
                                <input className=" text-center col-span-4" type='email' name={"newEmail"} placeholder={"New email"} value={emailFormData.newEmail} onChange={onChangeEmail}/>
                                <input className=" text-center col-span-4" type='password' name={"password"} placeholder={"Password"} value={emailFormData.password} onChange={onChangeEmail}/>
                                <button className="bg-green-500 text-uiLight rounded-xl col-start-2 col-span-2" type="submit">Change email</button>
                            </form>
                        </div>
                    ):(
                        <div className="grid grid-cols-1 gap-3 w-[50%] mx-auto">
                                
                            <h1 className="text-4xl text-center">Change password</h1>

                            <form className=" grid grid-cols-4 gap-3 mx-[8vh]"  onSubmit={handleChangePassword}>
                                <input className=" text-center col-span-2" type='password' name={"oldPassword"} placeholder={"Old password"} value={passwordFormData.oldPassword} onChange={onChangePassword}/>
                                <input className=" text-center col-span-2" type='password' name={"newPassword"} placeholder={"New password"} value={passwordFormData.newPassword} onChange={onChangePassword}/>
                                <input className=" text-center col-span-4" type='email' name={"email"}placeholder={"Email"} value={passwordFormData.email} onChange={onChangePassword}/>
                                <button className="bg-green-500 text-uiLight rounded-xl col-start-2 col-span-2" type="submit">Change password</button>
                            </form>
                        </div>
                    )}
                    </>
                )
            }
            </div>
    )
}