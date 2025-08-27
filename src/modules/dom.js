import {currentFetchData, forecastFetchData} from './api.js';
import {capitalize, convertTime, getDailyAverage, getIconById, groupByDay,} from './func.js';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Title } from 'chart.js';
import {region} from "./location.js";
import {connectionError} from "./error.js";
Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title);
let myChart;

export async function loadData(city) {

    const mainContent = document.querySelector('.main__content');
    const errorContent = document.querySelector('.block__error-message');

    if (!navigator.onLine) {
        connectionError();
        return;
    }
    else {
        const connectionContent = document.querySelector('.block__connection-message');
        if (connectionContent.classList.contains('show')) {
            connectionContent.classList.remove('show');
        }
    }

    if (mainContent.classList.contains('show')) {
        mainContent.classList.remove('show');
    }

    const data = await currentFetchData(city);
    const data_forecast = await forecastFetchData(city);
    const data_groupbyday = groupByDay(data_forecast);
    const data_dailyaverage = getDailyAverage(groupByDay(data_forecast));

    const titleDate = document.querySelector(".header__title-date");
    titleDate.textContent = convertTime(data['dt']);
    const headerImage = document.querySelector(".current__header-image");
    headerImage.height = 72;
    headerImage.width = 72;
    headerImage.src = "src/assets/icons/" + getIconById(data["weather"][0]["icon"]);
    if (data["weather"][0]["icon"] === "01d") {
        headerImage.classList.add("animation");
    }
    else {
        headerImage.classList.remove("animation");
    }

    const currentLocation = document.querySelector(".current__header-location");
    const countryName = new Intl.DisplayNames(['ru'], { type: 'region' }).of(data["sys"]["country"]);
    currentLocation.textContent = `${data["name"]}, ${countryName}`;

    const currentTemp = document.querySelector(".current__body-temp");
    const currentCondition = document.querySelector(".current__body-condition");
    const currentFeel = document.querySelector(".current__body-feel");

    currentTemp.textContent = `${Math.round(data[`main`][`temp`])}°`;
    currentCondition.textContent = capitalize(data['weather'][0]['description']);
    currentFeel.textContent = `Ощущается как ${Math.round(data[`main`][`feels_like`])}°`;

    const humidity = document.querySelector(".humidity__info");
    const wind = document.querySelector(".wind__info");
    const pressure = document.querySelector(".pressure__info");
    const visibility = document.querySelector(".visibility__info");

    humidity.textContent = `${data[`main`][`humidity`]}%`;
    wind.textContent = `${Math.round(data[`wind`]['speed'])} км/ч`;
    pressure.textContent = `${data[`main`][`pressure`]} мбар`;
    visibility.textContent = `${Math.round(data[`visibility`] / 1000)} км`;

    // create block-future
    const futureList = document.querySelector(".future__list");
    futureList.innerHTML = '';
    const startIndex  = data_groupbyday.length === 5 ? 0 : 1;
    const endIndex  = data_groupbyday.length;

    for (let i = startIndex; i < endIndex; i++) {
        // get date
        const date = new Date(data_groupbyday[i][0]['dt_txt'].split(" ")[0]);


        // create basic blocks
        const futureday = document.createElement("li");
        futureday.className = "futureday";
        const imagefutureday = document.createElement("img");
        imagefutureday.className = "futureday-image";
        imagefutureday.src = "src/assets/icons/" + data_dailyaverage[i]["averageImage"];
        imagefutureday.height = 48;
        imagefutureday.width = 48;
        const firstblockfutureday = document.createElement("div");
        firstblockfutureday.className = "futureday-block1";
        const secondblockfutureday = document.createElement("div");
        secondblockfutureday.className = "futureday-block2";

        // date of each day forecast for 5 days
        const futureday_date = document.createElement("div");
        futureday_date.className = "futureday-date";
        const futureday_weekday = document.createElement("span");
        futureday_weekday.textContent = capitalize(date.toLocaleDateString('ru-RU', { weekday: 'long' }));
        futureday_weekday.className = "futureday-weekday";
        const futureday_month = document.createElement("span");
        futureday_month.textContent = date.toLocaleDateString('ru-RU', {day: 'numeric', month: 'long'});
        futureday_month.className = "futureday-month";

        futureday_date.append(futureday_weekday);
        futureday_date.append(futureday_month);

        const futureday_condition = document.createElement("span");
        futureday_condition.textContent = capitalize(data_dailyaverage[i]["averageCondition"]);
        futureday_condition.className = "futureday-condition";
        const futureday_properties = document.createElement("div");
        futureday_properties.className = "futureday-properties";
        const futureday_wind = document.createElement("span");
        futureday_wind.textContent = `💨${data_dailyaverage[i]["averageWind"]}км/ч`;
        futureday_wind.className = "futureday-wind";
        const futureday_humidity = document.createElement("span");
        futureday_humidity.textContent = `💧${data_dailyaverage[i]["averageHumidity"]}%`;
        futureday_humidity.className = "futureday-humidity";
        const futureday_temp = document.createElement("span");
        futureday_temp.textContent = `${data_dailyaverage[i]["averageTemp"]}°`;
        futureday_temp.className = "futureday-temp";
        const futureday_feel = document.createElement("span");
        futureday_feel.textContent = `${data_dailyaverage[i]["averageFeelTemp"]}°`;
        futureday_feel.className = "futureday-feel";
        futureday_properties.append(futureday_wind, futureday_humidity);

        firstblockfutureday.append(futureday_date, futureday_condition, futureday_properties);
        secondblockfutureday.append(futureday_temp, futureday_feel);

        futureday.append(imagefutureday, firstblockfutureday, secondblockfutureday);

        futureList.append(futureday);
    }

    //create block-continues
    const continues_data_hours = [];
    const continues_data_temp = [];
    const continues_data_feel = [];
    for (let i = 0; i < 7; i++){
        const hours = data_forecast["list"][i]["dt_txt"].split(" ")[1].split(":")[0] + ":" + data_forecast["list"][i]["dt_txt"].split(" ")[1].split(":")[1];
        const temp = Math.round(data_forecast["list"][i]["main"]["temp"]);
        const feel = Math.round(data_forecast["list"][i]["main"]["feels_like"]);
        continues_data_hours.push(hours);
        continues_data_temp.push(temp)
        continues_data_feel.push(feel);
    }

    if (myChart) {
        myChart.destroy();
    }

    const ctx = document.getElementById('continues_weather').getContext('2d');
    myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: continues_data_hours,
            datasets: [{
                label: "Температура (°C)",
                data: continues_data_temp,
                borderColor: "#3a86ff",
                backgroundColor: "rgba(58, 134, 255, 0.1)",
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 3,
                pointHoverRadius: 5,
                pointBackgroundColor: "#fff",
                pointBorderColor: "#3a86ff"
            }, {
                label: "Ощущается как (°C)",
                data: continues_data_feel,
                borderColor: "#8338ec",
                backgroundColor: "rgba(131, 56, 236, 0.1)",
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 0,
                pointHoverRadius: 0,
                pointBackgroundColor: "#fff",
                pointBorderColor: "#8338ec",
                borderDash: [5, 5],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#333',
                        font: {
                            size: 12,
                            family: "'Roboto', 'Poppins-regural', 'Roboto-regural', Arial, sans-serif;"
                        },
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    titleFont: { size: 14 },
                    bodyFont: { size: 12 },
                    padding: 12,
                    cornerRadius: 6,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw}°C`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#666',
                        font: {
                            size: 11
                        }
                    },
                    border: {
                        display: false,
                    }
                },
                y: {
                    min: Math.min(...continues_data_feel) - 2,
                    max: Math.max(...continues_data_temp) + 2,
                    grid: {
                        color: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#666',
                        font: {
                            size: 11
                        }
                    },
                    border: {
                        display: false,
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    })

    if (!mainContent.classList.contains('show')) {
        mainContent.classList.add('show');
        errorContent.classList.remove('show');
    }

    requestAnimationFrame(async () => {
        const mainCards = document.querySelectorAll('.main__content > div');
        mainCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add("show");
            }, index * 300);
        });
    });
}