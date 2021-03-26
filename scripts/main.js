import tabJourOrdre from "./Utilitaire/gestionTemps.js";
// console.log(tabJourOrdre);
const CLEFAPI = "ee5c6e0bfa728de718cc4146b40103c6";
let resultatAPI;

const temps = document.querySelector(".temps");
const temperature = document.querySelector(".temperature");
const localisation = document.querySelector(".localisation");
const heure = document.querySelectorAll(".heure-prevision");
const tempHeure = document.querySelectorAll(".heure-temperature");
const jourDiv = document.querySelectorAll(".jour-prevision");
const jourTemp = document.querySelectorAll(".jour-temperature");
const imageIcon = document.querySelectorAll(".logo-meteo");
const chargementContainer = document.querySelector(".overlay-icon-chargement");

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            // console.log(position);
            let long = position.coords.longitude;
            let lat = position.coords.latitude;
            AppelAPI(long, lat);
        },
        () => {
            alert(
                `Vous avez refusé la géolocalisation, l'application ne peut pas fonctionner, veuillez l'activer. !`
            );
        }
    );
}

function AppelAPI(long, lat) {
    fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=metric&lang=fr&appid=${CLEFAPI}`
    )
        .then((reponse) => {
            return reponse.json();
        })
        .then((data) => {
            console.log(data);
            resultatAPI = data;

            temps.innerText = resultatAPI.current.weather[0].description;
            temperature.innerText = `${Math.trunc(resultatAPI.current.temp)}°`;
            localisation.innerText = resultatAPI.timezone;

            // les heures pas tranches de 3 avec leurs températures

            let heureActuelle = new Date().getHours();

            for (let i = 0; i < heure.length; i++) {
                let heureInc = heureActuelle + i * 3;

                if (heureInc > 24) {
                    heure[i].innerText = `${heureInc - 24} h`;
                } else if (heureInc === 24) {
                    heure[i].innerText = ` 00 h`;
                } else {
                    heure[i].innerText = `${heureInc} h`;
                }
            }

            //temp pour 3h

            for (let j = 0; j < tempHeure.length; j++) {
                tempHeure[j].innerText = `${Math.trunc(
                    resultatAPI.hourly[j * 3].temp
                )}°`;
            }

            // trois premières lettres du jour

            for (let k = 0; k < jourDiv.length; k++) {
                jourDiv[k].innerText = tabJourOrdre[k].slice(0, 3);
            }

            // températura par jour

            for (let m = 0; m < jourTemp.length; m++) {
                jourTemp[m].innerText = `${Math.trunc(
                    resultatAPI.daily[m + 1].temp.day
                )}°`;
            }

            // icone dynamique

            if (heureActuelle >= 6 && heureActuelle < 21) {
                imageIcon.src = `ressources/jour/${resultatAPI.current.weather[0].icon}.svg`;
            } else {
                imageIcon.src = `ressources/nuit/${resultatAPI.current.weather[0].icon}.svg`;
            }

            chargementContainer.classList.add("disparition");
        });
}
