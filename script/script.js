session = {}
function clearSession() {
    session = {}
}
function getAccessToken() {
    return new Promise((resolve, reject) => {
        axios.get('https://www.universal-tutorial.com/api/getaccesstoken', {
            headers: {
                "Accept": "application/json",
                "api-token": "2PqS4GRtEVinVPePXIrQdBYezWJPdNP8DcTbKyu4LQgSAVl_sihDUgMpSviAzog0XdE",
                "user-email": "ahmedzamora1312@gmail.com"
            }
        })
            .then((response) => {
                resolve(response)
                // session["auth_token"] = response.data.auth_token
                // return response.data.auth_token

            })
            .catch((error) => {
                reject();
                console.log(error)
            })
    })

}
// setInterval(clearSession,180000);



function createOptionsOfCountry(countryName) {
    let countrySelect = document.getElementById("country-select")
    let option = document.createElement("option")
    countrySelect.appendChild(option)
    let country = document.createTextNode(countryName)
    option.appendChild(country)

}
function getSortedNames(countries) {
    sortedCounties = new Array()
    for (let key in countries) {
        sortedCounties.push(countries[key].name)
    }
    sortedCounties.sort()
    return sortedCounties
}

function getCountries(authToken) {
    return new Promise((resolve, reject) => {
        let url = "https://www.universal-tutorial.com/api/countries/"
        let token = `Bearer ${authToken}`
        axios.get(url, {
            headers: {
                "Authorization": token,
                "Accept": "application/json"
            }
        })
            .then((response) => {
                let countries = response.data
                for (let country in countries) {
                    createOptionsOfCountry(countries[country].country_name)
                }
                resolve(authToken)
            })
            .catch((error) => {
                console.log(error)
            })
    }).catch((error) => {
        alert(error)
    })

}

function getStates(authToken, country) {
    return new Promise((resolve, reject)=>{
        let url = `https://www.universal-tutorial.com/api/states/${country}`
        let token = `Bearer ${authToken}`
        axios.get(url, {
            headers: {
                "Authorization": token,
                "Accept": "application/json"
            }
        })
            .then((response) => {
                // let countries = response.data
                console.log(response)
                // let sortedCountries = getSortedNames(countries)
                // for (country of sortedCountries) {
                //     createOptionsOfCountry(country)
                // }
                resolve(authToken)
            })
            .catch((error) => {
                console.log(error)
            })
    }).catch((error)=>{
        alert(error)
    })

}


function createOptionsOfCity(cityName) {
    let countrySelect = document.getElementById("city-select")
    let option = document.createElement("option")
    countrySelect.appendChild(option)
    let city = document.createTextNode(cityName)
    option.appendChild(city)

}

getAccessToken().then((response) => {
    const authToken = response.data.auth_token
    return getCountries(authToken)
}).then((response) => {
    return getStates(response, "Egypt")
})