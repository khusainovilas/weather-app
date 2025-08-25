import axios from "axios";

export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function convertTime(epoch) {
    const date = new Date(epoch * 1000);
    const weekday = date.toLocaleString('ru-RU', { weekday: 'long' });
    const day = date.getDate();
    const month = date.toLocaleString('ru-RU', { month: 'long' });
    return `${weekday}, ${day} ${month}`;
}
export function groupByDay(weatherData) {
    const forecastList = weatherData.list || weatherData;
    const days = [];
    const currentUniqueDay = [];

    forecastList.forEach(item => {
        const date = item["dt_txt"].split(' ')[0];

        if (!currentUniqueDay.includes(date)) {
            currentUniqueDay.push(date);
            days.push([]);
        }
        const dayIndex = currentUniqueDay.indexOf(date);
        days[dayIndex].push(item);
    });
    return days;
}

function findMostFrequentString(array) {
    const frequencyMap = {};
    for (const str of array) {
        frequencyMap[str] = (frequencyMap[str] || 0) + 1;
    }
    let mostFrequent = '';
    let maxCount = 0;
    for (const str in frequencyMap) {
        if (frequencyMap[str] > maxCount) {
            mostFrequent = str;
            maxCount = frequencyMap[str];
        }
    }
    return mostFrequent;
}

export function getIconById(id) {
    const weatherConditions = {
        "01d": "wi-day-sunny.svg",
        "01n": "wi-night-clear.svg",
        "02d": "wi-day-cloudy.svg",
        "02n": "wi-night-alt-cloudy.svg",
        "03d": "wi-cloud.svg",
        "03n": "wi-cloud.svg",
        "04d": "wi-cloud.svg",
        "04n": "wi-cloud.svg",
        "11d": "wi-thunderstorm.svg",
        "11n": "wi-thunderstorm.svg",
        "09d": "wi-showers.svg",
        "09n": "wi-showers.svg",
        "10d": "wi-rain.svg",
        "10n": "wi-rain.svg",
        "13d": "wi-snow.svg",
        "13n": "wi-snow.svg",
        "50d": "wi-fog.svg",
        "50n": "wi-fog.svg",
    };
    return weatherConditions[id];
}

export function getDailyAverage(dayData) {
    const result = [];
    const daysArray = Array.isArray(dayData) ? dayData : Object.values(dayData);

    for (let i = 0; i < daysArray.length; i++) {
        let averageWind = 0;
        let averageHumidity = 0;
        let averageTemp = 0;
        let averageFeelTemp = 0;
        let averageCondition = [];
        let averageImage = [];
        const currentDayData = daysArray[i];
        let hourInDay = 0;

        for (let j = 0; j < currentDayData.length; j++) {
            const hourData = currentDayData[j];
            hourInDay++;

            // get average speed wind
            averageWind += hourData["wind"]["speed"];
            // get average humidity
            averageHumidity += hourData["main"]["humidity"];
            // get average temp and feel temp
            averageTemp += hourData["main"]["temp"];
            averageFeelTemp += hourData["main"]["feels_like"];
            // get average condition
            averageCondition.push(hourData["weather"][0]["main"]);
            averageImage.push(hourData["weather"][0]["icon"])
        }

        if (hourInDay > 0) {
            averageWind = Math.round(averageWind / hourInDay);
            averageHumidity = Math.round(averageHumidity / hourInDay);
            averageTemp = Math.round(averageTemp / hourInDay);
            averageFeelTemp = Math.round(averageFeelTemp / hourInDay);
            averageCondition = findMostFrequentString(averageCondition);
            averageImage = getIconById(findMostFrequentString(averageImage));

            result.push({
                averageWind: averageWind,
                averageHumidity: averageHumidity,
                averageTemp: averageTemp,
                averageFeelTemp: averageFeelTemp,
                averageCondition: averageCondition,
                averageImage: averageImage,
            });
        }
    }
    return result;
}

export function dumpLocalStorage() {
    const dump = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const raw = localStorage.getItem(key);
        let value;
        try {
            value = JSON.parse(raw);
        } catch {
            value = raw;
        }
        dump[key] = value;
    }
    console.log('localStorage dump:', dump);
    return dump;
}