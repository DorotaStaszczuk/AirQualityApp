document.addEventListener('DOMContentLoaded', function () {
    const formSubmit = document.querySelector('.form-submit');
    let displayAddress = document.querySelector('.display-address');
    const pm1 = document.querySelector('.pm1');
    const pm10 = document.querySelector('.pm10');
    const pm25 = document.querySelector('.pm25');
    const pressure = document.querySelector('.pressure');
    const humidity = document.querySelector('.humidity');
    const temperature = document.querySelector('.temperature');
    let advice = document.querySelector('.advice');
    const responseSection = document.querySelector('.response-section');
    const errorMessage = document.querySelector('.error');

    formSubmit.addEventListener('click', function(e) {
        e.preventDefault();
        let lat = document.querySelector('.szerokosc').value;
        let lang = document.querySelector('.dlugosc').value;
        responseSection.classList.add('none');

        fetch(`https://airapi.airly.eu/v2/measurements/nearest?lat=${lat}&lng=${lang}&maxDistanceKM=5`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': 'pl',
                apikey: config['apiKey'],
            },
        })
            .then((data) => data.json())
            .then((response2) => {
                console.log(response2);
                if (response2.errorCode === 'INSTALLATION_NOT_FOUND'){
                    errorMessage.innerText = 'W odległości 5 km od podanego punktu nie znaleziono żadnej instalacji, spróbuj ponownie'
                    errorMessage.classList.contains('none') && errorMessage.classList.remove('none');
                }
                else {
                    errorMessage.classList.add('none');
                    responseSection.classList.contains('none') && responseSection.classList.remove('none');
                    pm1.innerText = `${response2.current.values[0].value}`;
                    pm25.innerText = `${response2.current.values[1].value}`;
                    pm10.innerText = `${response2.current.values[2].value}`;
                    pressure.innerText = ` ${response2.current.values[3].value} hPa`;
                    humidity.innerText = ` ${response2.current.values[4].value} %`;
                    temperature.innerText = ` ${response2.current.values[5].value} °C`;

                    advice.innerText = `${response2.current.indexes[0].description} ${response2.current.indexes[0].advice}`;
                    if (response2.current.indexes[0].level === 'LOW' || response2.current.indexes[0].level === 'VERY_LOW') {
                        responseSection.classList.add('green');
                    } else if (
                        response2.current.indexes[0].level === 'HIGH' ||
                        response2.current.indexes[0].level === 'VERY_HIGH'
                    ) {
                        responseSection.classList.add('red');
                    }
                    else { responseSection.classList.add('yellow')}

                    fetch(`https://airapi.airly.eu/v2/installations/nearest?lat=${lat}&lng=${lang}&maxDistanceKM=5`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            apikey: config['apiKey'],
                        },
                    })
                    .then((data) => data.json())
                    .then((response2) => {
                        console.log(response2);
                        responseSection.classList.contains('none') && responseSection.classList.remove('none');
                        displayAddress.innerText = `${response2[0].address.displayAddress1}, ul. ${response2[0].address.displayAddress2}`;
                    });
                }
            });
    });
});
