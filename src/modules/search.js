import {region, setRegion} from "./location.js";
import {loadData} from "./dom.js";
import {geoError} from "./error.js";

export async function handleRegionInput() {
    const searchInput = document.querySelector(".header__search-input");
    const cityInput = searchInput.value.trim();
    try {
        setRegion(cityInput);
        await loadData(region);
    } catch (error) {
        geoError();
    }
}

export async function initSearchInput() {
    const searchInput = document.querySelector(".header__search-input");
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleRegionInput();
        }
    })
}