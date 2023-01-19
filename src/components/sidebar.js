import { NavLink } from "react-router-dom"
import HandymanIcon from '@mui/icons-material/Handyman';
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';

const icons = {
    "handyman"          : HandymanIcon,
    "handymanOutline"   : HandymanOutlinedIcon,
}

function AccountCirkel({initials, handleLogout}){
    return(
        <div className="flex rounded-full bg-uiLight min-w-[5rem] min-h-[5rem] justify-center items-center font-bold mt-2">
            <p className="text-4xl">{initials}</p>
        </div>
    )
}

function Link({link, icon, iconOutline}){
    return (
        <NavLink to={link}>
        {({isActive}) => isActive ?
        (
            <span className="material-symbols-outlined text-2xl text-uiLight">
                {icon}
            </span>
        ) : (
            <span className="material-symbols-outlined text-2xl text-uiLight">
                {iconOutline}
            </span>
        )}
        </NavLink>
    );
}

export function SideBar(){
    return(
        <div className="flex flex-col min-w-[7rem] max-w-[40%] h-full fixed left-0 top-0 bg-uiNav justify-between items-center">
            <AccountCirkel initials={"TL"}/>
            <div className="flex flex-col text-4xl">
                <Link link={'/meters'} icon={'handyman'} iconOutline={'handymanOutline'}/>
                <Link link={'/'} icon={'home'}/>
                <Link link={'/'} icon={'monitoring'}/>
            </div>

            <Link link={'/'} icon={'logout'}/>
        </div>
    )
}