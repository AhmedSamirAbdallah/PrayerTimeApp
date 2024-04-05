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

function onChangeCountry(response){
    return new Promise((resolve, reject)=>{
        let country = document.getElementById("country-select")
        country.addEventListener('change',(event)=>{
            let ctx = {
                "authToken":response,
                "country":event.target.value
            }
            resolve(ctx)
        })
    })
}

function createOptionsOfCountry(countryName,countryId) {
    let countrySelect = document.getElementById("country-select")
    let option = document.createElement("option")
    option.id=countryId
    countrySelect.appendChild(option)
    let country = document.createTextNode(countryName)
    option.appendChild(country)

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
                    createOptionsOfCountry(countries[country].country_name,countries[country].country_short_name.toLowerCase())
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

function createOptionsOfCity(cityName) {
    let countrySelect = document.getElementById("city-select")
    let option = document.createElement("option")
    option.id = cityName.toLowerCase()
    countrySelect.appendChild(option)
    let city = document.createTextNode(cityName)
    option.appendChild(city)

}


function getStates(ctx) {
    return new Promise((resolve, reject)=>{
        let url = `https://www.universal-tutorial.com/api/states/${ctx.country}`
        let token = `Bearer ${ctx.authToken}`
        axios.get(url, {
            headers: {
                "Authorization": token,
                "Accept": "application/json"
            }
        })
            .then((response) => {
                let states = response.data
                for ( let state in states) {
                    createOptionsOfCity(states[state].state_name)
                }
                resolve()
            })
            .catch((error) => {
                console.log(error)
            })
    }).catch((error)=>{
        alert(error)
    })

}



getAccessToken().then((response) => {
    const authToken = response.data.auth_token
    return getCountries(authToken)
}).then((response) => {
    return onChangeCountry(response)
}).then((response)=>{
    return getStates(response)
})