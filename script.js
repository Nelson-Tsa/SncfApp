const input = document.getElementById('cityInput');
const inputArriver = document.getElementById('villeArriver');
const resultsDiv = document.getElementById('results');
const resultsDiv2 = document.getElementById('results2');
const loadingDiv = document.getElementById('loading');
const loadingDiv2 = document.getElementById('loading2');
const date1 = document.getElementById('date');
const heureDepart = document.getElementById('time');
const boutonRecherche = document.getElementById('rechercheDepart');
const boutonRecherche2 = document.getElementById('RechercheArrivee');
const date2 = document.getElementById('date2');
const heureArriver = document.getElementById('time2');



const departureRadio = document.getElementById('departureSearch');
const arrivalRadio = document.getElementById('arrivalSearch');
const departureBlock = document.getElementById('departureBlock');
const arrivalBlock = document.getElementById('arrivalBlock');

const ligneItineraire = document.querySelector('.itineraire');

// --- historique ----
const bouttonHistorique = document.getElementById('supprimerHistorique');
const histDepart = document.getElementById('historique-de-depart');
const histArriver = document.getElementById('historique-de-arriver');
let NomvilleDepart 
let NomvilleArriver

let tableauHistoriqueDepart = []
let tableauHistoriqueArriver = []

function viderHistorique(){
    localStorage.clear();
    location.reload();
}



function StockageHistoriqueDepart(villeDepart,  codeInseeDepart, villeArriver, codeInseeArriver, heureDepart, dateDepart) {
    tableauHistoriqueDepart.push({villeDepart,  codeInseeDepart, villeArriver, codeInseeArriver, heureDepart, dateDepart});
    localStorage.setItem('historiqueDepart', JSON.stringify(tableauHistoriqueDepart));
}


function StockageHistoriqueArriver(villeDepart, codeInseeDepart, villeArriver, codeInseeArriver, heureArriver, dateArriver) {
    tableauHistoriqueArriver.push({villeDepart, codeInseeDepart, villeArriver, codeInseeArriver, heureArriver, dateArriver});
    localStorage.setItem('historiqueArriver', JSON.stringify(tableauHistoriqueArriver));
}

function afficherHistoriqueDepart(){
    const historiqueD = localStorage.getItem('historiqueDepart');
    if(historiqueD){
        tableauHistoriqueDepart = JSON.parse(historiqueD); 
    }
    const titre = document.createElement('h2');
    titre.textContent = '';
    document.querySelector('#historique-de-depart').appendChild(titre);
    tableauHistoriqueDepart.forEach(historiqueDepart => {
     let heureCorrect = historiqueDepart.heureDepart.slice(0, 2);
     let minuteCorrect = historiqueDepart.heureDepart.slice(2, 4);
     let heureTotalCorrect = `${heureCorrect}:${minuteCorrect}`;

     let dateCorrect = historiqueDepart.dateDepart.replace(/(\d{4})(\d{2})(\d{2})/, '$3/$2/$1');
     
       document.querySelector('#historique-de-depart').innerHTML += 
       `<div class="HistoriqueDepart"
              data-villedepart="${historiqueDepart.villeDepart}" 
              data-codeinseepart="${historiqueDepart.codeInseeDepart}" 
              data-villearriver="${historiqueDepart.villeArriver}" 
              data-codeinseearriver="${historiqueDepart.codeInseeArriver}" 
              data-heuredepart="${historiqueDepart.heureDepart}" 
              data-datedepart="${historiqueDepart.dateDepart}">
       <p class="ville-depart">${historiqueDepart.villeDepart} > ${historiqueDepart.villeArriver} le ${dateCorrect} à ${heureTotalCorrect}</p>
       </div>`;
    });

    // Gere le clic sur un element de l'historique
    document.querySelectorAll('.HistoriqueDepart').forEach(item => {
        item.addEventListener('click', () => {
            const villeDepart = item.dataset.villedepart;
            const codeInseeDepart = item.dataset.codeinseepart;
            const villeArriver = item.dataset.villearriver;
            const codeInseeArriver = item.dataset.codeinseearriver;
            const heureDepart1 = item.dataset.heuredepart;
            const dateDepart = item.dataset.datedepart;
    
            // Mettre à jour les champs de saisie
            input.value = villeDepart;
            inputArriver.value = villeArriver;

            date1.value = formatDateForInput(dateDepart); // Format YYYY-MM-DD
            heureDepart.value = formatTimeForInput(heureDepart1); // Format HH:MM

            // Vide la div itineraire
            ligneItineraire.innerHTML = ``

            // Vide les markers
            clearMarkers();

            // Basculer vers le mode départ
            departureRadio.checked = true;
            departureBlock.style.display = 'block';
            arrivalBlock.style.display = 'none';
    
            // Réexécuter la recherche
            searchJourneys(codeInseeDepart, codeInseeArriver, dateDepart, heureDepart1);
        });
    });
}


function afficherHistoriqueArriver(){
    const historiqueA = localStorage.getItem('historiqueArriver');
    if(historiqueA){
        tableauHistoriqueArriver = JSON.parse(historiqueA); 
    }
    const titre = document.createElement('h2');
    titre.textContent = '';
    document.querySelector('#historique-de-arriver').appendChild(titre);
    tableauHistoriqueArriver.forEach(historiqueArriver => {
        let heureCorrect = historiqueArriver.heureArriver.slice(0, 2);
     let minuteCorrect = historiqueArriver.heureArriver.slice(2, 4);
     let heureTotalCorrect = `${heureCorrect}:${minuteCorrect}`;
     let dateCorrect = historiqueArriver.dateArriver.replace(/(\d{4})(\d{2})(\d{2})/, '$3/$2/$1');
       document.querySelector('#historique-de-arriver').innerHTML += 
       `<div class="HistoriqueArriver"
              data-villedepart="${historiqueArriver.villeDepart}" 
              data-codeinseepart="${historiqueArriver.codeInseeDepart}" 
              data-villearriver="${historiqueArriver.villeArriver}" 
              data-codeinseearriver="${historiqueArriver.codeInseeArriver}" 
              data-heurearriver="${historiqueArriver.heureArriver}" 
              data-datearriver="${historiqueArriver.dateArriver}">
       <p class="ville-depart">${historiqueArriver.villeDepart} > ${historiqueArriver.villeArriver} le ${dateCorrect} à ${heureTotalCorrect}</p>
       </div>`;
    });

    // Gerer le clic sur l'historique pour afficher les trajets
    document.querySelectorAll('.HistoriqueArriver').forEach(item => {
        item.addEventListener('click', () => {
            const villeDepart = item.dataset.villedepart;
            const codeInseeDepart = item.dataset.codeinseepart;
            const villeArriver = item.dataset.villearriver;
            const codeInseeArriver = item.dataset.codeinseearriver;
            const heureArriver = item.dataset.heurearriver;
            const dateArriver = item.dataset.datearriver;
    
            // Mettre à jour les champs de saisie
            input.value = villeDepart;
            inputArriver.value = villeArriver;

            date2.value = formatDateForInput(dateArriver); // Format YYYY-MM-DD
            time2.value = formatTimeForInput(heureArriver); // Format HH:MM
             // Basculer vers le mode arrivée
            arrivalRadio.checked = true;
            departureBlock.style.display = 'none';
            arrivalBlock.style.display = 'block';
    
            // Vide la div itineraire
            ligneItineraire.innerHTML = ``

            // Vide les markers
            clearMarkers();

            // Réexécuter la recherche
            searchJourneys2(codeInseeDepart, codeInseeArriver, dateArriver, heureArriver);
        });
    });
}

function ajouterTrajetHistoriqueDepart(villeDepart, villeArriver, heureDepart, dateDepart) {
    const nouveauHistorique = document.createElement('div');
    let heureCorrect = heureDepart.slice(0, 2);
    let minuteCorrect = heureDepart.slice(2, 4);
    let heureTotalCorrect = `${heureCorrect}:${minuteCorrect}`
    let dateCorrect = dateDepart.replace(/(\d{4})(\d{2})(\d{2})/, '$3/$2/$1');
    nouveauHistorique.innerHTML = `<div class="HistoriqueDepart">
       <p class="ville-depart">${villeDepart} > ${villeArriver} le ${dateCorrect} à ${heureTotalCorrect}</p>
       </div>`;
    histDepart.appendChild(nouveauHistorique);
    // StockageHistoriqueDepart(villeDepart, villeArriver, heureDepart, dateDepart);
    // console.log("coucou")
}

function ajouterTrajetHistoriqueArriver(villeDepart, villeArriver, heureArriver, dateArriver) {
    const nouveauHistorique = document.createElement('div');
    let heureCorrect = heureArriver.slice(0, 2);
     let minuteCorrect = heureArriver.slice(2, 4);
     let heureTotalCorrect = `${heureCorrect}:${minuteCorrect}`
     let dateCorrect = dateArriver.replace(/(\d{4})(\d{2})(\d{2})/, '$3/$2/$1');
    nouveauHistorique.innerHTML += `<div class="HistoriqueArriver">
       <p class="ville-depart">${villeDepart} > ${villeArriver} le ${dateCorrect} à ${heureTotalCorrect}</p>
       </div>`;
    histArriver.appendChild(nouveauHistorique);
     // StockageHistoriqueArriver(villeDepart, villeArriver,heureArriver, dateArriver);
    // console.log("coucou")
}

bouttonHistorique.addEventListener('click', viderHistorique)
afficherHistoriqueArriver()
afficherHistoriqueDepart()


// --- fin historique ----

// affichage des icônes de transport dans la ligne itinéraire
let iconTGV = () => "<img id='icon-tgv' src='images/tgv-front.svg' alt='Icone train grande vitesse' />";
let iconTMD = () => "<img id='icon-TMD' src='images/ter-front.svg' alt='Icone train moyenne distance' />";
let iconBus = () => "<img id='icon-bus' src='images/bus-front.svg' alt='Icone autocar' />";

let codeInseeArriver 
let codeInseeDepart 
let dateDepart 
let timeoutId;
let timeStart

let dateArriver
let timeEnd

// Initialisation de l'interface
window.addEventListener('DOMContentLoaded', () => {
    // Par défaut, afficher le bloc de recherche par départ et cacher le bloc de recherche par arrivée
    departureBlock.style.display = 'block';
    arrivalBlock.style.display = 'none';
    departureRadio.checked = true;
});

// Gestion des boutons radio pour changer le type de recherche
departureRadio.addEventListener('change', () => {
    if (departureRadio.checked) {
        departureBlock.style.display = 'block';
        arrivalBlock.style.display = 'none';
    }
});

arrivalRadio.addEventListener('change', () => {
    if (arrivalRadio.checked) {
        departureBlock.style.display = 'none';
        arrivalBlock.style.display = 'block';
    }
});

//---------------------Ville Depart---------------------


// Détecte la saisie utilisateur avec délai de 300ms
input.addEventListener('input', (e) => {
    clearTimeout(timeoutId);
    const query = e.target.value.trim();
    
    if (query.length < 3) {
        resultsDiv.innerHTML = '';
        return;
    }

    timeoutId = setTimeout(() => searchCity(query), 300);
});

async function searchCity(query) {
    try {
        loadingDiv.style.display = 'block';
        resultsDiv.innerHTML = '';

        const response = await fetch(
            `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(query)}&fields=code,nom,codesPostaux&limit=5`
        );

        if (!response.ok) throw new Error('Erreur API');
        
        const cities = await response.json();
        
        

        if (cities.length === 0) {
            resultsDiv.innerHTML = 'Aucun résultat trouvé';
            return;
        }
       
        // Affiche les résultats
        ligneItineraire.innerHTML = ``
        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = cities.map(city => `
            <div class="result-item" 
                 data-code="${city.code}"
                 style="padding: 5px; cursor: pointer; border-bottom: 1px solid #eee;">
                ${city.nom} (CP: ${city.codesPostaux[0]}) - INSEE: ${city.code}
            </div> 
        `).join('');
       
               
        // Gère le clic sur un résultat
        document.querySelectorAll('.result-item').forEach(item => {
            item.addEventListener('click', () => {
                
                input.value = item.textContent.split(' - ')[0].trim();
               
                resultsDiv.innerHTML = `${item.dataset.code}`;
                codeInseeDepart = `admin:fr:${item.dataset.code}`;
                
                // --Recuperation du nom de la ville--
                let pipou = input.value
                NomvilleDepart = pipou.split('(').shift().trim();
                
                console.log(codeInseeDepart)
                resultsDiv.style.display = 'none';
                return codeInseeDepart
                //alert(`Code INSEE sélectionné : ${item.dataset.code}`);
            });
        });

    } catch (error) {
        resultsDiv.innerHTML = 'Erreur lors de la recherche';
        console.error(error);
    } finally {
        loadingDiv.style.display = 'none';
    }
    
}



//---------------------Ville Arrivée---------------------
inputArriver.addEventListener('input', (e) => {
    clearTimeout(timeoutId);
    const villeData = e.target.value.trim();
    
    if (villeData.length < 3) {
        resultsDiv2.innerHTML = '';
        return;
    }

    timeoutId = setTimeout(() => searchCityArriver(villeData), 300);
});

async function searchCityArriver(villeData) {
    try {
        loadingDiv2.style.display = 'block';
        resultsDiv2.innerHTML = '';

        const response = await fetch(
            `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(villeData)}&fields=code,nom,codesPostaux&limit=5`
        );

        if (!response.ok) throw new Error('Erreur API');
        
        const cities2 = await response.json();
        
        if (cities2.length === 0) {
            resultsDiv2.innerHTML = 'Aucun résultat trouvé';
            return;
        }

        // Affiche les résultats
        resultsDiv2.style.display = 'block';
        resultsDiv2.innerHTML = cities2.map(city => `
            <div class="result2-item" 
                 data-code="${city.code}"
                 style="padding: 5px; cursor: pointer; border-bottom: 1px solid #eee;">
                ${city.nom} (CP: ${city.codesPostaux[0]}) - INSEE: ${city.code}
            </div>
        `).join('');

        // Gère le clic sur un résultat
        document.querySelectorAll('.result2-item').forEach(item2 => {
            item2.addEventListener('click', () => {
                
                inputArriver.value = item2.textContent.split(' - ')[0].trim();
                resultsDiv2.innerHTML = `${item2.dataset.code}`;

                // --Recuperation du nom de la ville--
                let pipou2 = inputArriver.value
                NomvilleArriver = pipou2.split('(').shift().trim();
                
                codeInseeArriver = `admin:fr:${item2.dataset.code}`
                resultsDiv2.style.display = 'none';
                console.log(codeInseeArriver)
                return codeInseeArriver
                
                //alert(`Code INSEE sélectionné : ${item.dataset.code}`);
            });
        });

    } catch (error) {
        resultsDiv2.innerHTML = 'Erreur lors de la recherche';
        console.error(error);
    } finally {
        loadingDiv2.style.display = 'none';
    }
    
    
}




//-----------------------Fonction API départ a partir d'une heure----------------------

date.addEventListener('input', (e) => {
   const dateDepartChoix = e.target.value.split('-').join('').trim();
   dateDepart = dateDepartChoix
    console.log(dateDepart)
});

heureDepart.addEventListener('input', (e) => {
    const heureDepartChoix = e.target.value.split(':').join('').trim();
    timeStart = `${heureDepartChoix}00`
    console.log(timeStart)
})


boutonRecherche.addEventListener('click', () => {
    clearMarkers()
    searchJourneys(codeInseeDepart, codeInseeArriver, dateDepart, timeStart);
    StockageHistoriqueDepart(NomvilleDepart,codeInseeDepart, NomvilleArriver,codeInseeArriver, timeStart, dateDepart)
    ajouterTrajetHistoriqueDepart(NomvilleDepart, NomvilleArriver, timeStart, dateDepart)
})

const apiKey = 'f3a26e07-0df5-48e8-b17a-b9d05b5a820a'
async function searchJourneys(codeInseeDepart, codeInseeArriver, dateDepart, timeStart) {
    try {
        const apiDepart = `https://api.navitia.io/v1/coverage/sncf/journeys?to=${codeInseeArriver}&from=${codeInseeDepart}&datetime_represents=departure&datetime=${dateDepart}T${timeStart}&min_nb_journeys=3&`
        
        const response = await fetch(apiDepart, { headers: { Authorization: apiKey }
        });
        
        const data = await response.json();
        console.log(data);  // Vérifiez les données dans la console

        const journey = data.journeys
        
        for (y=0 ; y < journey.length ; y++){
            
            const itinerary = journey[y].sections
            // console.log(itinerary)

             // --------- Récupération latitude et longitude ------------
            // Coordonnées de départ (section 1)
            const departureSection = itinerary[1];
            const departureCoords = departureSection?.from?.stop_point?.coord || {};
            
            // Coordonnées d'arrivée (dernière section de transport)
            // const arrivalSection = itinerary.findLast(s => s.type === 'public_transport');
            const arrivalSection = itinerary.find(s => s.type === 'public_transport');
            const arrivalCoords = arrivalSection?.to?.stop_point?.coord || {};

             // Nom des gares de départ et d'arrivée
             const departureName1 = departureSection?.from?.stop_point?.name || '';
             const arrivalName1 = arrivalSection?.to?.stop_point?.name || '';
 
             departLatitude = departureCoords.lat
             departLongitude = departureCoords.lon
             arriveeLatitude = arrivalCoords.lat
             arriveeLongitude = arrivalCoords.lon
 
             addGareDepart(departLatitude, departLongitude, departureName1)
             addGareArriver(arriveeLatitude, arriveeLongitude, arrivalName1)
            
            // ------ Fin de récupération de latitude et longitude ------------

            // ------ Affichage des itinéraires suivant horaire de départ  ------------
            let departureTime = formatTime(journey[y].departure_date_time)
            let arrivalTime = formatTime(journey[y].arrival_date_time)

            let fullItinerary = ''; // Variable pour cumuler/joindre les portions d'itinéraires
            let visitedCities = []; // Track cities to avoid duplication
            let journeySteps = []; // Store the names of cities as steps
            
            // Liste des types de transport valides
            const validTransportTypes = [
                "Train grande vitesse", 
                "TER / Intercités", 
                "Autocar"
            ];

            for (i=0 ; i < itinerary.length ; i++ ) {
    
                const itineraryType = itinerary[i].type
                let currentCity = ''; // Variable to hold the current city's name
                let public_transport = ''; // Variable pour stocker le type de transport
                
                // Vérifie si display_informations est défini avant d'accéder à physical_mode
                if (itinerary[i].display_informations) {
                    public_transport = itinerary[i].display_informations.physical_mode; // Récupère le type de transport
                }

                // Fonction pour extraire uniquement le nom de la ville sans la région entre parenthèses
                const getCityName = (location) => {
                    return location.name.split(' (')[0]; 
                };
                
                if (itineraryType === 'public_transport' && validTransportTypes.includes(public_transport)) {
                    
                    currentCity = getCityName(itinerary[i].from); // Ville de départ
                    if (!visitedCities.includes(currentCity)) {
                        visitedCities.push(currentCity); // Ajouter si non déjà ajouté
                        journeySteps.push(`${getTransportIcon(public_transport)} ${currentCity}`); // Ajouter à l'itinéraire avec l'icône
                        // journeySteps.push(currentCity); // Ajouter à l'itinéraire
                    }
                    currentCity = getCityName(itinerary[i].to); // Ville d'arrivée
                    if (!visitedCities.includes(currentCity)) {
                        visitedCities.push(currentCity); // Ajouter si non déjà ajouté
                        journeySteps.push(`${getTransportIcon(public_transport)} ${currentCity}`); // Ajouter à l'itinéraire avec l'icône
                    }
                    
                }

                // switch (itineraryType) {
                    
                //     case "public_transport":
                        
                //         public_tranport = itinerary[i].display_informations.physical_mode

                //         // --Ajout des gares de depart et d'arriver sur la carte--  Remplacé plus haut pour obtenir les bon noms de gare
                //         // addGareDepart(departLatitude, departLongitude, departureName)
                //         // addGareArriver(arriveeLatitude, arriveeLongitude, arrivalName)
                //         // --Fin de l'ajout des gares de depart et d'arriver sur la carte--

                //         if (public_tranport === "Train grande vitesse" || public_tranport === "TER / Intercités" || public_tranport === "Autocar") {
                //             console.log(getTransportIcon(public_transport))
                            
                //             currentCity = getCityName(itinerary[i].from); // Ville de départ
                //             if (!visitedCities.includes(currentCity)) {
                //                 visitedCities.push(currentCity); // Ajouter si non déjà ajouté
                //                 journeySteps.push(`${currentCity} ${getTransportIcon(public_transport)}`); // Ajouter à l'itinéraire avec l'icône
                //                 // journeySteps.push(currentCity); // Ajouter à l'itinéraire
                //             }
                //             currentCity = getCityName(itinerary[i].to); // Ville d'arrivée
                //             if (!visitedCities.includes(currentCity)) {
                //                 visitedCities.push(currentCity); // Ajouter si non déjà ajouté
                //                 journeySteps.push(`${currentCity} ${getTransportIcon(public_transport)}`); // Ajouter à l'itinéraire avec l'icône
                //             }

                //             // // Ajout de l'icone de transport
                //             // if (public_tranport === "Train grande vitesse"){
                //             //     itineraryElement = `${iconTGV()}`;
                //             // } else if (public_tranport === "TER / Intercités"){
                //             //     itineraryElement = `${iconTMD()}`;
                //             // } else if (public_tranport === "Autocar"){
                //             //     itineraryElement = `${iconBus()}`
                //             // } else {
                //             //     itineraryElement = ``;
                //             // }
                //         }
                //         break
                    
                //     case "waiting":
                //         // console.log(departureTime)
                //         // console.log(arrivalTime)
                //         // itineraryElement = ` correspondance > `
                //         break
    
                //     case "crow_fly":
                //         // console.log("marche")
                //         break
    
                //     default :
                //         // console.log("autre type")
                // }

                // Si l'étape est un transport ou une ville qui n'a pas été ajoutée, on l'ajoute
                fullItinerary = `${journeySteps.join(' > ')} > `;
                
            }
             
            if (ligneItineraire) {
                ligneItineraire.innerHTML += `<div>${departureTime} > ${fullItinerary} ${arrivalTime}</div>`;
            }
            // ------ Fin d'affichage des itinéraires suivant horaire de départ  ------------

        }
        
    } catch (error) {
        console.error(error);
    }
}

// -----------------------Fonction API arrivée a partir d'une heure----------------------

const apiKey2 = 'f3a26e07-0df5-48e8-b17a-b9d05b5a820a'
async function searchJourneys2(codeInseeDepart, codeInseeArriver, dateArriver, timeEnd) {
    try {
        const apiArriver = `
https://api.sncf.com/v1/coverage/sncf/journeys?to=${codeInseeArriver}&from=${codeInseeDepart}&datetime_represents=arrival&datetime=${dateArriver}T${timeEnd}&`
        const response2 = await fetch(apiArriver, { headers: { Authorization: apiKey2 }
    });
        const data2 = await response2.json();
        console.log(data2);

        const journey = data2.journeys
        
        for (y=0 ; y < journey.length ; y++){
            
            const itinerary = journey[y].sections
            // console.log(itinerary)

             // --------- Récupération latitude et longitude ------------
            // Coordonnées de départ (section 1)
            const departureSection = itinerary[1];
            const departureCoords = departureSection?.from?.stop_point?.coord || {};
            
            // Coordonnées d'arrivée (dernière section de transport)
            // const arrivalSection = itinerary.findLast(s => s.type === 'public_transport');
            const arrivalSection = itinerary.find(s => s.type === 'public_transport');
            const arrivalCoords = arrivalSection?.to?.stop_point?.coord || {};

             // Nom des gares de départ et d'arrivée
             const departureName1 = departureSection?.from?.stop_point?.name || '';
             const arrivalName1 = arrivalSection?.to?.stop_point?.name || '';
 
             departLatitude = departureCoords.lat
             departLongitude = departureCoords.lon
             arriveeLatitude = arrivalCoords.lat
             arriveeLongitude = arrivalCoords.lon
 
             addGareDepart(departLatitude, departLongitude, departureName1)
             addGareArriver(arriveeLatitude, arriveeLongitude, arrivalName1)
            
            // ------ Fin de récupération de latitude et longitude ------------

            // ------ Affichage des itinéraires suivant horaire de départ  ------------
            let departureTime = formatTime(journey[y].departure_date_time)
            let arrivalTime = formatTime(journey[y].arrival_date_time)

            let fullItinerary = ''; // Variable pour cumuler/joindre les portions d'itinéraires
            let visitedCities = []; // Track cities to avoid duplication
            let journeySteps = []; // Store the names of cities as steps
            
            // Liste des types de transport valides
            const validTransportTypes = [
                "Train grande vitesse", 
                "TER / Intercités", 
                "Autocar"
            ];

            for (i=0 ; i < itinerary.length ; i++ ) {
    
                const itineraryType = itinerary[i].type
                let currentCity = ''; // Variable to hold the current city's name
                let public_transport = ''; // Variable pour stocker le type de transport
                
                // Vérifie si display_informations est défini avant d'accéder à physical_mode
                if (itinerary[i].display_informations) {
                    public_transport = itinerary[i].display_informations.physical_mode; // Récupère le type de transport
                }

                // Fonction pour extraire uniquement le nom de la ville sans la région entre parenthèses
                const getCityName = (location) => {
                    return location.name.split(' (')[0]; 
                };
                
                if (itineraryType === 'public_transport' && validTransportTypes.includes(public_transport)) {
                    
                    currentCity = getCityName(itinerary[i].from); // Ville de départ
                    if (!visitedCities.includes(currentCity)) {
                        visitedCities.push(currentCity); // Ajouter si non déjà ajouté
                        journeySteps.push(`${getTransportIcon(public_transport)} ${currentCity}`); // Ajouter à l'itinéraire avec l'icône
                        // journeySteps.push(currentCity); // Ajouter à l'itinéraire
                    }
                    currentCity = getCityName(itinerary[i].to); // Ville d'arrivée
                    if (!visitedCities.includes(currentCity)) {
                        visitedCities.push(currentCity); // Ajouter si non déjà ajouté
                        journeySteps.push(`${getTransportIcon(public_transport)} ${currentCity}`); // Ajouter à l'itinéraire avec l'icône
                    }
                    
                }

                // Si l'étape est un transport ou une ville qui n'a pas été ajoutée, on l'ajoute
                fullItinerary = `${journeySteps.join(' > ')} > `;
                
            }
             
            if (ligneItineraire) {
                ligneItineraire.innerHTML += `<div>${departureTime} > ${fullItinerary} ${arrivalTime}</div>`;
            }
            // ------ Fin d'affichage des itinéraires suivant horaire de départ  ------------

        }

    } catch (error) {
        console.error(error);
    }
}

// Fonction pour obtenir l'icône du transport en fonction du type
function getTransportIcon(transportType) {
    switch (transportType) {
        case "Train grande vitesse":
            // return `${iconTGV()}`;  // Utilise l'icône TGV
            return iconTGV();  // Utilise l'icône TGV
        case "TER / Intercités":
            // return `${iconTMD()}`;  // Utilise l'icône TER / Intercités
            return iconTMD();  // Utilise l'icône TER / Intercités
        case "Autocar":
            return `${iconBus()}`;  // Utilise l'icône Autocar
        default:
            return '';  // Aucun icône si aucun des types correspond
    }
}

// Fonction pour sortir du format "YYYYMMDDTHHMMSS" l'information heure en HH:MM
function formatTime(dateArray) {
    
    const selectTime = dateArray.split('T')[1];
    
    
    const hours = selectTime.slice(0, 2);
    const minutes = selectTime.slice(2, 4);
    
    
    return `${hours}:${minutes}`;
}

date2.addEventListener('input', (e) => {
    const dateArriverChoix = e.target.value.split('-').join('').trim();
    dateArriver = dateArriverChoix
     console.log(dateArriver)
 });
 
 time2.addEventListener('input', (e) => {
     const heureArriverChoix = e.target.value.split(':').join('').trim();
     timeEnd = `${heureArriverChoix}00`
     console.log(timeEnd)
 })


 boutonRecherche2.addEventListener('click', () => {
    searchJourneys2(codeInseeDepart, codeInseeArriver, dateArriver, timeEnd)
     ajouterTrajetHistoriqueArriver(NomvilleDepart, NomvilleArriver, timeEnd, dateArriver)
     StockageHistoriqueArriver(NomvilleDepart,codeInseeDepart, NomvilleArriver, codeInseeArriver, timeEnd, dateArriver)
     clearMarkers()
 })


// ---Fonction qui ajoute des marqueurs sur la carte---


function addGareDepart(lat, lng, nom) {
    L.marker([lat, lng])
     .addTo(map)
     .bindPopup(nom)
     .openPopup();
  }
  function addGareArriver(lat, lng, nom) {
    L.marker([lat, lng])
     .addTo(map)
     .bindPopup(nom)
     .openPopup();
  }

  function clearMarkers() {
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
}

// Script d'initialisation de la carte 
const map = L.map('map').setView([46.6031, 2.4469], 6);
  
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);



// Fonction me remplir les dates et l'heure au moment du clic sur l'historique

function formatDateForInput(dateStr) {
    // Convertit "YYYYMMDD" en "YYYY-MM-DD"
    const year = dateStr.slice(0, 4);
    const month = dateStr.slice(4, 6);
    const day = dateStr.slice(6, 8);
    return `${year}-${month}-${day}`;
}

function formatTimeForInput(timeStr) {
    // Convertit "HHMMSS" en "HH:MM"
    const hours = timeStr.slice(0, 2);
    const minutes = timeStr.slice(2, 4);
    return `${hours}:${minutes}`;
}