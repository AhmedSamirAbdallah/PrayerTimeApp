let cache = {}
let cachedResponse;

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
            })
            .catch((error) => {
                reject();
                alert(error)
            })
    })

}

function onChangeCountry(response) {
    return new Promise((resolve, reject) => {
        let country = document.getElementById("country-select")
        country.addEventListener('change', (event) => {
            let ctx = {
                "authToken": response,
                "country": event.target.value
            }
            resolve(ctx)
        })
    })
}

function createOptionsOfCountries(countries) {
    let countrySelect = document.getElementById("country-select")
    countrySelect.innerHTML = "<option selected disabled>Select Country</option>"
    for (let country in countries) {
        let option = document.createElement("option")
        countrySelect.appendChild(option)
        option.textContent = (countries[country].country_name)
    }
}

function getCountries(authToken) {
    return new Promise((resolve, reject) => {
        let url = "https://www.universal-tutorial.com/api/countries/"
        let token = `Bearer ${authToken}`

        if (cache.countries) {
            console.log("Cached the Countries")
            createOptionsOfCountries(cache.countries)
            resolve(authToken)
        }
        else {
            axios.get(url, {
                headers: {
                    "Authorization": token,
                    "Accept": "application/json"
                }
            })
                .then((response) => {
                    cache.countries = response.data
                    createOptionsOfCountries(response.data)
                    resolve(authToken)
                })
                .catch((error) => {
                    alert(error)
                    reject(error)
                })
        }
    })
}

function createOptionsOfCities(states) {
    let citySelect = document.getElementById("city-select")
    citySelect.innerHTML = "<option selected disabled>Select City</option>"

    for (let state in states) {
        let option = document.createElement("option")
        citySelect.appendChild(option)
        option.textContent = states[state].state_name
    }
}

function getStates(ctx) {
    return new Promise((resolve, reject) => {
        let url = `https://www.universal-tutorial.com/api/states/${ctx.country}`
        let token = `Bearer ${ctx.authToken}`
        if (cache[ctx.country]) {
            console.log("Cached cities")
            createOptionsOfCities(cache[ctx.country])
            resolve(ctx)
        }
        else {
            axios.get(url, {
                headers: {
                    "Authorization": token,
                    "Accept": "application/json"
                }
            })
                .then((response) => {
                    createOptionsOfCities(response.data)
                    resolve(ctx)
                })
                .catch((error) => {
                    reject(error)
                    alert(error)
                })
        }
    })
}
function toggleshowTimings(response = {}, behaviour) {
    const prayers = [
        { id: "fajr-card", name: "Fajr" },
        { id: "sunrise-card", name: "Sunrise" },
        { id: "zhuhr-card", name: "Dhuhr" },
        { id: "asr-card", name: "Asr" },
        { id: "maghrib-card", name: "Maghrib" },
        { id: "isha-card", name: "Isha" },
    ]
    prayers.forEach(prayer => {
        if (behaviour == "show") {
            document.getElementById(prayer.id).removeAttribute("hidden");
            document.getElementById(prayer.id).innerHTML = `<h2>${prayer.name}</h2><h3>${response[prayer.name]}</h3>`
        }
        else {
            document.getElementById(prayer.id).setAttribute("hidden", true);
        }
    })
}

function getPrayerTime(country, city) {
    let url = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}`
    axios.get(url)
        .then((resposne) => {
            // console.log(resposne.data.data.timings)
            toggleshowTimings(resposne.data.data.timings, "show")
        }).catch((error) => {
            alert(error)
        })
}

getAccessToken()
    .then((response) => getCountries(response.data.auth_token))
    .then((response) => onChangeCountry(response))
    .then((response) => getStates(response))
    .then((response) => {
        cachedResponse = response
        document.getElementById("country-select").addEventListener('change', (event) => {
            document.getElementById("country-info").innerHTML = ""
            document.getElementById("city-select").innerHTML = "";
            toggleshowTimings("hide")
            response.country = event.target.value
            getStates(response)
        })
    })
document.getElementById("city-select").addEventListener('change', (event) => {
    let countryInfo = document.getElementById("country-info")
    countryInfo.innerHTML = `<h1>${cachedResponse.country} ,</h1><h1>${event.target.value}</h1>`
    getPrayerTime(cachedResponse.country, event.target.value)
})
