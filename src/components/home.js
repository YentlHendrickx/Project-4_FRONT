function Card({color, line1, line2, line3}){
    const CardStyle = {
        backgroundColor: color,
        color: '#DADFF7',
        borderRadius: '35px',
        minWidht:'500px',
        minHeight:'275px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'

    }


    return(
        <div style={CardStyle}>
                <p className="text-4xl pb-5">{line1}</p>
                <p className="text-6xl py-5">{line2}</p>
                <p className="text-4xl pt-5">{line3}</p>
        </div>
    )

}

function Home() {

    const HomeStyle = {
        marginLeft: '153px',
    }

    return(
        <div style={HomeStyle}>
            <h1 className="p-5 text-4xl">Uw Verbruik</h1>
            <h2 className="px-5 text-2xl">Deze week</h2>
            <div className="grid sm:grid-cols-1  lg:grid-cols-2 gap-6 p-10">
                <Card color={'#477998'} line1={'Dag verbruik'} line2={'3,5'} line3={'kWh'}/>
                <Card color={'#785964'} line1={'Nacht verbruik'} line2={'6,9'} line3={'kWh'}/>
                <Card color={'#FA7E61'} line1={'Hoogste dag verbruik'} line2={'15 kWh'} line3={'17/01/2023'}/>
                <Card color={'#93032E'} line1={'Hoogste uur verbruik'} line2={'12 kWh'} line3={'17/01/2023 14:00'}/>
            </div>
        </div>
        )
}

export default Home;