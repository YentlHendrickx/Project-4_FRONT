// Sidebar buttons and navlink
import { IconButton } from "@mui/material";
import { NavLink } from "react-router-dom";

// Import icons from our custom icon implementation
import { icons } from "../icons";

// Recoil
import { useRecoilValue } from "recoil";
import { initialsState } from "../store";

import {useState, useEffect} from 'react';

// Return profile circle with initials
function AccountCirkel({initials}){
    return (
        <div className="flex rounded-full bg-uiLight min-w-[5rem] min-h-[5rem] justify-center items-center font-bold">
            <p className="text-4xl">{initials}</p>
        </div>
    );
}
// Navlinks in sidebar with navigation
function Link({link, icon}){
    return (
        <NavLink to={link} className="my-8 scale-[2]">
        {({isActive}) => isActive ?
        (
            <span className="w-fit h-fit">    
                {icons[icons.findIndex(i => i.name === icon)].icon} 
            </span>
        ) : (
            <span>
                {icons[icons.findIndex(i => i.name === (icon + "Outlined"))].icon}
            </span>
        )}
        </NavLink>
    );
}

const NAV_BREAKPOINT = 768

// Main sidebar component, initialize sidebar with icons and profile
export function SideBar({handleLogout}){
    // Get initials from recoil
    const initals = useRecoilValue(initialsState);

    const [openNav, setOpenNav] = useState(false);

    useEffect(() => {
        window.addEventListener(
          "resize",
          () => {
            if (window.innerWidth <= NAV_BREAKPOINT) {
                setOpenNav(true);
            } else {
                setOpenNav(false);
            }
          }
        );

        if (window.innerWidth <= NAV_BREAKPOINT) {
            setOpenNav(true);
        } else {
            setOpenNav(false);
        }
        
      }, []);

    return (
        <div className="w-full ">
         {!openNav ? (
            <div className="w-[7rem] h-full fixed left-0 top-0 bg-uiNav">
                <div className="flex flex-col h-full w-full justify-between items-center mt-2 pb-8">
                    <NavLink to={'/profile'}><AccountCirkel initials={initals} handleLogout={handleLogout}/></NavLink>

                    <div className="flex flex-col text-uiLight">
                        <Link link={'/'} icon={'home'}/>
                        <Link link={'/graphs'} icon={'monitoring'}/>
                        <Link link={'/meters'} icon={'build'}/>
                        <Link link={'/help'} icon={'Info'}/>
                    </div>

                    <IconButton color="secondary" className=" scale-[1.75]" onClick={handleLogout}>
                        {icons[icons.findIndex(i => i.name === "logout")].icon}
                    </IconButton>
                </div>
            </div>
           ) : (  
                <div className="w-full h-[12rem] top-0 static bg-uiNav">
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col h-full w-full ml-2">
                            <NavLink className="mt-2 w-fit" to={'/profile'}><AccountCirkel initials={initals} handleLogout={handleLogout}/></NavLink>
                            <IconButton color="secondary" className="w-fit !mt-6 !ml-[1.25rem] scale-[1.75]" onClick={handleLogout}>
                                    {icons[icons.findIndex(i => i.name === "logout")].icon}
                            </IconButton>
                        </div>

                        
                        <div className="flex flex-col h-full w-full justify-around">
                            <div className="flex flex-row w-full h-full text-uiLight justify-around">
                                <Link link={'/'} icon={'home'}/>
                                <Link link={'/graphs'} icon={'monitoring'}/>
                            </div>
                            <div className="flex flex-row w-full h-full text-uiLight justify-around">
                                <Link link={'/meters'} icon={'build'}/>
                                <Link link={'/help'} icon={'Info'}/>
                            </div>
                        </div>
                    </div>
                </div>
           )}
        </div>
    );
}
