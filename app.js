const btnBuscar = document.getElementById('btnBuscar')
const inputCiudad = document.getElementById('ciudad')
const resultado = document.getElementById('resultado')

const API_KEY = CONFIG.API_KEY



btnBuscar.addEventListener('click', function() {

 

    const ciudad = inputCiudad.value 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`

    if(ciudad.trim() === '') {
        resultado.innerHTML = `<p>Por favor escribe una ciudad.</p>`
        return
    }

    fetch(url)
    .then(function(respuesta) {
        return respuesta.json()
    })
    .then(function(datos){

        if (datos.cod === '404') {
            resultado.innerHTML = `<p>Ciudad no encontrada. Intenta con otro nombre.</p>`
            return
        }
        console.log(datos.weather[0].icon)
        resultado.innerHTML = `
            <h2>${datos.name}</h2>
            <img src="https://openweathermap.org/img/wn/${datos.weather[0].icon}@2x.png" alt="${datos.weather[0].description}" />
            <p>Temperatura: ${datos.main.temp} °C</p>
            <p>Humedad: ${datos.main.humidity}%</p>
            <p>Tiempo: ${datos.weather[0].description}</p>
        `
    })
})
   inputCiudad.addEventListener('keydown', function(evento){
        if (evento.key === 'Enter') {
            btnBuscar.click()
        }
    })