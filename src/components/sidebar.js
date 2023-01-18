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

function Link(props){
    if(props.link === ''){
        return <NavLink end to="" className={({isActive}) => isActive ? "active" : undefined}>{props.children}</NavLink>
    }
    else{
        return <NavLink to="login" className={({isActive}) => isActive ? "active" : undefined}>{props.children}</NavLink>    
    }
    

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
    const Icon ={
        fontSize: '5rem',
        color: '#DADFF7'
    }
    return(
        <div style={SideBarStyle}>
            <AccountCirkel initials={"TL"}/>
            <div style={Icons}>
                <Link link={''}>
                    <span style={Icon} class="material-symbols-outlined">
                        handyman
                    </span>
                </Link>
                <Link link={''}>
                    <span style={Icon} class="material-symbols-outlined">
                        home
                    </span>
                </Link>
                <Link link={''}>
                    <span style={Icon} class="material-symbols-outlined">
                        monitoring
                    </span>
                </Link>
            </div>
            <Link link={'login'}>
                <span  style={Icon} class="material-symbols-outlined">
                    logout
                </span>
            </Link>

        </div>
    )
}