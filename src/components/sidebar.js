import { IconButton } from "@mui/material";
import { NavLink } from "react-router-dom";
import { icons } from "../icons";

// Recoil
import { useRecoilValue } from "recoil";
import { initialsState } from "../store";

function AccountCirkel({initials, handleLogout}){
    return(
        <div className="flex rounded-full bg-uiLight min-w-[5rem] min-h-[5rem] justify-center items-center font-bold">
            <p className="text-4xl">{initials}</p>
        </div>
    )
}

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

export function SideBar({handleLogout}){
    const initals = useRecoilValue(initialsState);

    return(
        <div className="w-[7rem] h-full fixed left-0 top-0 bg-uiNav">
            <div className="flex flex-col h-full w-full justify-between items-center mt-2 pb-8">
                <NavLink to={'/profile'}><AccountCirkel initials={initals} handleLogout={handleLogout}/></NavLink>

                <div className="flex flex-col text-uiLight">
                    <Link link={'/'} icon={'home'}/>
                    <Link link={'/graphs'} icon={'monitoring'}/>
                    <Link link={'/meters'} icon={'build'}/>
                </div>

                <IconButton color="secondary" className="scale-[1.75]" onClick={handleLogout}>
                    {icons[icons.findIndex(i => i.name === "logout")].icon}
                </IconButton>
            </div>
        </div>
    )
}
