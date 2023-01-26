var config = {
    host: 'zkkzn87ew4rjt3n.eu.qlikcloud.com',
    prefix: '/',
    port: 443,
    isSecure: true,
    webIntegrationId: '_WA9Avm_qD0Jfm-r78_MKfbZ6T7Fb1N2'
};

//Redirect to login if user is not logged in
async function login() {
    function isLoggedIn() {
        return fetch("https://" + config.host + "/api/v1/users/me", {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'qlik-web-integration-id': config.webIntegrationId,
            },
        }).then(response => {
            return response.status === 200;
        });
    }
    return isLoggedIn().then(loggedIn => {
        if (!loggedIn) {
            window.location.href = "https://" + config.host + "/login?qlik-web-integration-id=" + config.webIntegrationId + "&returnto=" + location.href;
            throw new Error('not logged in');
        }
    });
}
login().then(() => {
    require.config({
        baseUrl: (config.isSecure ? "https://" : "http://") + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources",
        webIntegrationId: config.webIntegrationId
    });

    //TODO: Fill in your app ID (APP API) and Object ID (Visualization API)
    require(["js/qlik"], function (qlik) {
        qlik.on("error", function (error) {
            $('#popupText').append(error.message + "<br>");
            $('#popup').fadeIn(1000);
        });
        $("#closePopup").click(function () {
            $('#popup').hide();
        });



        //TODO: Open your application 
        var app = qlik.openApp("c16d3353-ee3a-457e-9de8-66f1b0f55c0e", config);
        //TODO: Get your visualizations 
        //get objects -- inserted here --

        $(".qcmd").click(function () {
            app.clearAll();
        });


        app.visualization.get('VEzxP').then(function (vis) {
            vis.show("qv01");
        });
        app.visualization.get('mGxVj').then(function (vis) {
            vis.show("qv02");
        });
        app.visualization.get('GJKGGP').then(function (vis) {
            vis.show("qv03");
        });
        app.visualization.get('cecWcKK').then(function (vis) {
            vis.show("qv04");
        });
    });
})