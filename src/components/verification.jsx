import axios from "axios";
import React, { useEffect, useState} from "react";
import ReactConfetti from "react-confetti";
import { NavLink } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { icons } from "../icons";


// Show confetti :yey:
function Confetti() {
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
    );
}

// Verification
export default function Verification({setIsLoggedIn, changeEmail=false}){
    const [searchParams] = useSearchParams();
    const [resp, setResp] = useState("");
    const [token] = useState(searchParams.get('token'));
    const [email] = useState(searchParams.get('email'));
    
    useEffect(() => {
        const fetchData = async () => {  
            // If change email, query is different (passed from route)
            let query = `${process.env.REACT_APP_API_URL}User/verify/${token}`;

            if (changeEmail){
                query = `${process.env.REACT_APP_API_URL}User/verifyEmailChangeToken/${token}?newMail=${email}`;
            }
            
            // Get reponse, catch error
            axios.get(query)
            .then (response => {
                // Set response
                setResp(response.data) 
            })
            .catch (error => setResp(error.response.data));    
        }
        
        // Make sure user is logged out
        localStorage.removeItem('token');
        setIsLoggedIn(false);

        // Check for token in url
        if (token !== null) {
            fetchData();
        }
        // eslint-disable-next-line
    }, []);
       
       if (resp === "Email verified" || resp === "Email already verified") {
            return (
                <>
                    <Confetti/>
                    <div className="bg-uiLight flex flex-col items-center justify-center h-screen">
                        <span className="text-edit scale-[10] mb-10">{icons[icons.findIndex(i => i.name === 'check')].icon}</span>
                        <p className="mt-10 pt-10 text-4xl">{resp}</p>
                        <NavLink className="mt-2 text-2xl text-slate-600 hover:text-slate-400" to={'/login'} >
                            Back to Login
                        </NavLink>
                    </div>
                </>
            );
        }

        if (resp === 'Invalid token') {
            return (
                <div className=" bg-red-100 flex flex-col items-center justify-center h-screen">
                    <span className=" text-uiPrimary scale-[10] mb-10">{icons[icons.findIndex(i => i.name === 'error')].icon}</span>
                    <p className="mt-10 pt-10 text-4xl">{resp}</p>
                    <NavLink className="mt-2 text-2xl text-slate-600 hover:text-slate-400" to={'/login'} >
                        Back to Login
                    </NavLink>
                </div>
            ); 
        }

        if (token == null) {
            return (
                <div className=" bg-red-100 flex flex-col items-center justify-center h-screen">
                    <span className=" text-uiPrimary scale-[10] mb-10">{icons[icons.findIndex(i => i.name === 'error')].icon}</span>
                    <p className="mt-10 pt-10 text-4xl">No Token</p>
                    <NavLink className="mt-2 text-2xl text-slate-600 hover:text-slate-400" to={'/login'} >
                        Back to Login
                    </NavLink>
                </div>
            );
        }  
}