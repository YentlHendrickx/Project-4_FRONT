import { CheckCircle} from "@mui/icons-material";
import axios from "axios";
import React, { useEffect, useState} from "react";
import ReactConfetti from "react-confetti";
import { NavLink } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { icons } from "../icons";


function Conefttti() {
    const [windowDimension, setDimension] = useState({width: window.innerWidth, height: window.innerHeight})

    const detectSize = () =>{
        setDimension({width: window.innerWidth, height: window.innerHeight});
    }

    useEffect(()=> {
        window.addEventListener('resize', detectSize);
        return ()=>{
            window.removeEventListener('resize', detectSize);
        }
    }, [windowDimension]);


    return(
            <ReactConfetti
                width={windowDimension.width}
                height={windowDimension.height}
                numberOfPieces={1000}
                gravity={0.13}
                recycle={false}
                />
    )
}
export default function Verification(){
    const [searchParams] = useSearchParams();
    const [resp, setResp] = useState("");
    
    const token = searchParams.get('token')
    

    
    useEffect(() => {
        const fetchData = async () => {
            axios.get(process.env.REACT_APP_API_URL + "User/verify/" + token ).then(response => setResp(response.data) ).catch(error => setResp(error.response.data))
            
        }
    
        fetchData();
    
       }, []);
       console.log(resp)
       
       if (resp === "Email verified"){
       return(<>
        <Conefttti/>
        <div className="bg-uiLight flex flex-col items-center justify-center h-screen">
            {/* <CheckCircle className="text-edit scale-[10] mb-10"/> */}
            <span className="text-edit scale-[10] mb-10">{icons[icons.findIndex(i => i.name === 'check')].icon}</span>
            <p className="mt-10 pt-10 text-4xl">Email Verified</p>
            <NavLink to={'/login'} >
                <p>Back to login</p>
            </NavLink>
        </div>
        </>)}

        if(token == null){
            return(
                <div className=" bg-red-100 flex flex-col items-center justify-center h-screen">
                    <span className=" text-uiPrimary scale-[10] mb-10">{icons[icons.findIndex(i => i.name === 'error')].icon}</span>
                    <p className="mt-10 pt-10 text-4xl">No token</p>
                    <NavLink to={'/login'} >
                        <p>Back to login</p>
                    </NavLink>
                </div>
        ) 
           }
           
         if(resp === 'Email already verified' || resp === 'Invalid token'){
            return(
                <div className=" bg-red-100 flex flex-col items-center justify-center h-screen">
                    <span className=" text-uiPrimary scale-[10] mb-10">{icons[icons.findIndex(i => i.name === 'error')].icon}</span>
                    <p className="mt-10 pt-10 text-4xl">{resp}</p>
                    <NavLink to={'/login'} >
                        <p>Back to login</p>
                    </NavLink>
                </div>
        ) 
       }
       
    
}