import { NavLink } from "react-router-dom"

function AccountCirkel({initials}){
    const AccountCirkel={
            display:'flex',
            borderRadius: '100%',
            backgroundColor:"#DADFF7",
            width:'100px',
            height: '100px',
            margin: '10px 26px 10px 26px',
            justifyContent:'center',
            alignItems: 'center',
            color: '#010400'
    }

    return(
            <div style={AccountCirkel}>
                <h1>{initials}</h1>
            </div>
    )
}

function Link({link, icon}){
    const Icon ={
        fontSize: '5rem',
        color: '#DADFF7'
    }

    // if(link == '/'){
        // return <NavLink end to="" className={({isActive}) => isActive ? "active" : undefined}>
        //             <span style={Icon} class="material-symbols-outlined">
        //                 {icon}
        //             </span>
        //         </NavLink>
    // }
    // else{
        return <NavLink to={link} className={({isActive}) => isActive ? "active" : undefined}>
                    <span style={Icon} class="material-symbols-outlined">
                        {icon}
                    </span>            
                </NavLink>    
    // }
    

}

export function SideBar(){
    const SideBarStyle = {
        display: 'flex',
        flexDirection: 'column',
        width:'153px',
        height:'100%',
        position: 'fixed',
        left:'0',
        top:'0',
        backgroundColor:'#477998',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
    const Icons = {
        display: 'flex',
        flexDirection: 'column',
        fontSize: '35px'
    }

    return(
        <div style={SideBarStyle}>
            <AccountCirkel initials={"TL"}/>
            <div style={Icons}>
                <Link link={'register'} icon={'handyman'}/>
                <Link link={'/'} icon={'home'}/>
                <Link link={''} icon={'monitoring'}/>
            </div>
            <Link link={'login'} icon={'logout'}/>
        </div>
    )
}