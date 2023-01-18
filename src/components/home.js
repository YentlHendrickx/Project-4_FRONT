function Card({color, line1, line2, line3}){
    const CardStyle = {
        backgroundColor: {color},
        color: '#DADFF7',
        borderRadius: '35px',
        width:'300px'
    }


    return(
        <div style={CardStyle}>
                <p>{line1}</p>
                <p>{line2}</p>
                <p>{line3}</p>
        </div>
    )

}

function Home() {

    return(
        <h1>haha</h1>
        )
}

export default Home;