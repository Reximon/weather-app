const btnBuscar = document.getElementById('btnBuscar')
const inputCiudad = document.getElementById('ciudad')
const resultado = document.getElementById('resultado')
const btnUbicacion = document.getElementById('btnUbicacion')

const cargando = document.getElementById('cargando')

const API_KEY = CONFIG.API_KEY

function buscarCiudad(nombre) {
    cargando.style.display = 'block'
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${nombre}&appid=${CONFIG.API_KEY}&units=metric&lang=es`

    const urlPrevision = `https://api.openweathermap.org/data/2.5/forecast?q=${nombre}&appid=${CONFIG.API_KEY}&units=metric&lang=es`

    fetch(urlPrevision)
        .then(function(respuesta) {
        return respuesta.json()
        })
        .then(function(datos) {
            const porDia = datos.list.filter(function(item) {
                return item.dt_txt.includes('12:00:00')
            })

            const divPrevision = document.getElementById('prevision')
            divPrevision.innerHTML = porDia.map(function(item) {
                return `<div>
                <p>${new Date(item.dt_txt).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" />
                <p>${Math.round(item.main.temp)} °C</p>
                </div>`
            }).join('')
            })

    fetch(url)
        .then(function(respuesta) {
            return respuesta.json()
        })
        .then(function(datos) {
            mostrarDatos(datos)
        })
}

function mostrarDatos(datos) {
        cargando.style.display = 'none'

        if (datos.cod === '404') {
            resultado.innerHTML = `<p>Ciudad no encontrada. Intenta con otro nombre.</p>`
            return
        }

        guardarCiudad(datos.name)
        cambiarFondo(datos.weather[0].icon)

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
                <div id="prevision"></div>
                </div>
            `
    
}

window.addEventListener('load', function() {
  // esto se ejecuta cuando la página termina de cargar

    const historial = JSON.parse(localStorage.getItem('ciudades')) || []

    const divHistorial = document.getElementById('historial')
    divHistorial.innerHTML = `<p style="text-align: center;">Últimas búsquedas:</p>` + historial.map(function(ciudad) {
        return `<span onclick="buscarCiudad('${ciudad}')">${ciudad}</span>`
    }).join(', ')
})

function guardarCiudad(nombre) {

    const historial = JSON.parse(localStorage.getItem('ciudades')) || []
    const historialLimitado = historial.slice(0,5)

    historial.unshift(nombre)

    localStorage.setItem('ciudades', JSON.stringify(historialLimitado))

    const divHistorial = document.getElementById('historial')
    divHistorial.innerHTML = `<p>Últimas búsquedas:</p>` + historial.map(function(ciudad) {
        return `<span onclick="buscarCiudad('${ciudad}')">${ciudad}</span>`
    }).join(', ')
    
}

btnUbicacion.addEventListener('click', function() {
   
        navigator.geolocation.getCurrentPosition(function(posicion) {
            const lat = posicion.coords.latitude
            const lon = posicion.coords.longitude
       

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEY}&units=metric&lang=es`


        cargando.style.display = 'block'
        fetch(url)
        .then(function(respuesta) {
            return respuesta.json()
        })
        .then(function(datos) {
            mostrarDatos(datos)
        })
     })
})

btnBuscar.addEventListener('click', function() {

    const ciudad = inputCiudad.value 

    if(ciudad.trim() === '') {
        resultado.innerHTML = `<p>Por favor escribe una ciudad.</p>`
        return
    }

    buscarCiudad(ciudad)
})

inputCiudad.addEventListener('keydown', function(evento){
        if (evento.key === 'Enter') {
            btnBuscar.click()
        }
    })


function cambiarFondo(icono) {
    if (icono.includes('01')) {
        document.body.className = 'despejado'
    } else if (icono.includes('02') || icono.includes('03') || icono.includes('04')) {
        document.body.className = 'nublado'
    } else if (icono.includes('09') || icono.includes('10')) {
        document.body.className = 'lluvia'
    } else if (icono.includes('11')) {
        document.body.className = 'tormenta'
    } else if (icono.includes('13')) {
        document.body.className = 'nieve'
    } else {
        document.body.className = 'noche'
    }
}