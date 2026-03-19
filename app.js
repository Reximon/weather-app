const btnBuscar = document.getElementById('btnBuscar')
const inputCiudad = document.getElementById('ciudad')
const resultado = document.getElementById('resultado')

const cargando = document.getElementById('cargando')

const API_KEY = CONFIG.API_KEY



btnBuscar.addEventListener('click', function() {

 

    const ciudad = inputCiudad.value 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`

    if(ciudad.trim() === '') {
        resultado.innerHTML = `<p>Por favor escribe una ciudad.</p>`
        return
    }
    cargando.style.display = 'block'
    fetch(url)
    .then(function(respuesta) {
        return respuesta.json()
    })
    .then(function(datos){

        cargando.style.display = 'none'

        if (datos.cod === '404') {
            resultado.innerHTML = `<p>Ciudad no encontrada. Intenta con otro nombre.</p>`
            return
        }
        

        resultado.innerHTML = `
            <h2>${datos.name}</h2>
            <img src="https://openweathermap.org/img/wn/${datos.weather[0].icon}@2x.png" alt="${datos.weather[0].description}" />
            <p>☀️ Temperatura: ${Math.round(datos.main.temp)} °C</p>
            <p>💦 Humedad: ${datos.main.humidity}%</p>
            <p>☁️ Tiempo: ${datos.weather[0].description}</p>
            <div class="datos-extras">
            <p>Más datos irrelevantes del día:</p>
            <p>🌡️ Temperatura minima ${Math.round(datos.main.temp_min)}°  y máxima ${Math.round(datos.main.temp_max)}° </p>
            <p>🍃 Velocidad del viento: ${datos.wind.speed} m/s</p>
            <p>🫠 Sensación térmica: ${datos.main.feels_like} °C</p>
            </div>
        `
    })
})
   inputCiudad.addEventListener('keydown', function(evento){
        if (evento.key === 'Enter') {
            btnBuscar.click()
        }
    })