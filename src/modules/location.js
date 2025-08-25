import {dumpLocalStorage} from "./func.js";

export const btnLocation = document.querySelector('.btn-current-location');
export let region;

try {
    region = JSON.parse(localStorage.getItem("region"));
    if (!region) region = 'London';
} catch {
    console.error('Error getting location');
    region = 'London';
}

export async function getRegionFromCoords(lat, lon) {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`);
    const data = await res.json();
    return data.address.state;
}

export function setRegion(newRegion) {
    region = newRegion;
    localStorage.setItem('region', JSON.stringify(region));

    dumpLocalStorage();
}
