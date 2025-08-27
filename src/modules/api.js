import axios from "axios";
import {connectionError} from "./error.js";

const API_KEY = import.meta.env.VITE_KEY_API;

export async function currentFetchData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ru`;
    try {
        const res = await axios.get(url);
        return res.data;
    } catch (e) {
        connectionError();
        return null;
    }
}

export async function forecastFetchData(city, days = 5) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=ru&cnt=${days * 8}`;
    try {
        const res = await axios.get(url);
        return res.data;
    } catch (e) {
        connectionError();
        return null;
    }
}

export async function getNameCityByCode(code) {
    try {
        const url = `https://restcountries.com/v3.1/alpha/${code}`;
        const response = await axios.get(url);
        const data = response.data;

        return data[0]['name']['nativeName']?.['rus']?.['official'] || data[0]['name']['nativeName']?.['rus']?.['common'] || data[0]['name']['common'];
    } catch {
        return code;
    }
}
