document.addEventListener('DOMContentLoaded', function () {
    const formSubmit = document.querySelector('.form-submit');
    let displayAddress1 = document.querySelector('.display-address1');
    let displayAddress2 = document.querySelector('.display-address2');
    const pm1 = document.querySelector('.pm1');
    const pm10 = document.querySelector('.pm10');
    const pm25 = document.querySelector('.pm25');
    const pressure = document.querySelector('.pressure');
    const humidity = document.querySelector('.humidity');
    const temperature = document.querySelector('.temperature');
    let advice = document.querySelector('.advice');

    formSubmit.addEventListener('click', function(e) {
        e.preventDefault();

        let lat = document.querySelector('.szerokosc').value;
        let lang = document.querySelector('.dlugosc').value;

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
                displayAddress1.innerText = `${response2[0].address.displayAddress1}`;
                displayAddress2.innerText = `ul. ${response2[0].address.displayAddress2}`;
            });

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
                pm1.innerText = `${response2.current.values[0].name}: ${response2.current.values[0].value} µg/m3`;
                pm25.innerText = `PM2,5: ${response2.current.values[1].value} µg/m3`;
                pm10.innerText = `${response2.current.values[2].name}: ${response2.current.values[2].value} µg/m3`;
                pressure.innerText = `Ciśnienie: ${response2.current.values[3].value} hPa`;
                humidity.innerText = `Wilgotność: ${response2.current.values[4].value} %`;
                temperature.innerText = `Temperatura: ${response2.current.values[5].value} °C`;

                advice.innerText = `${response2.current.indexes[0].description} ${response2.current.indexes[0].advice}`;
                if (response2.current.indexes[0].level === 'LOW' || response2.current.indexes[0].level === 'VERY_LOW') {
                    advice.classList.contains('advice') && advice.classList.add('green');
                } else if (
                    response2.current.indexes[0].level === 'HIGH' ||
                    response2.current.indexes[0].level === 'VERY_HIGH'
                ) {
                    advice.classList.contains('advice') && advice.classList.add('red');
                }
            });
    });
});
