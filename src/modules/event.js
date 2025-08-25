import {loadData} from "./dom.js";
import {region} from "./location.js";
import {setRegion} from "./location.js";
import {getNameCityByCode} from "./api.js";
import {geoError} from "./error.js";

const API_KEY = import.meta.env.VITE_KEY_API;

export function initNavigation() {
    const navigationBtn = document.querySelectorAll('.nav-btn');

    navigationBtn.forEach(btn => {
        btn.addEventListener('click', async () => {
            setRegion(btn.querySelector('.nav-city-text').textContent);
            console.log(region);
            await loadData(region);
        })
    })
}

export function initUpdateBtn() {
    const updateBtn = document.querySelector('.header__controls-update');
    const updateBtnError = document.querySelector('.error-message__main-tryBtn');

    updateBtn.addEventListener('click', async () => {
        await loadData(region);
    })
    updateBtnError.addEventListener('click', async () => {
        await loadData(region);
    })
}

export function initThemeBtn() {
    const themeBtn = document.querySelector('.header__controls-theme');
    const body = document.querySelector('.body');

    themeBtn.addEventListener('click',  () => {
        const blockBtn = document.querySelector('.controls-theme');
        if (blockBtn.classList.contains('light')) {
            blockBtn.classList.remove('light');
            blockBtn.classList.add('dark');
            body.classList.add('dark');
        }
        else {
            blockBtn.classList.remove('dark');
            blockBtn.classList.add('light');
            body.classList.remove('dark');
        }
    })
}

export async function initInput() {
    let timeout;
    const searchInput = document.querySelector('.header__search-input');
    const suggestions = document.querySelector('.header__search-block-suggesting');
    let cities = [];

    document.addEventListener('click', (e) => {
        if (!suggestions.contains(e.target) && e.target !== searchInput) {
            suggestions.classList.remove('show');
        }
    });

    searchInput.addEventListener('focus', () => {
        if (cities.length > 0) {
            suggestions.classList.add('show');
        }
    });

    searchInput.addEventListener("input", () => {
        suggestions.classList.remove('show');
        suggestions.innerHTML = "";
        clearTimeout(timeout);
        const query = searchInput.value.trim();
        if (query.length === 0) {
            cities = [];
            return;
        }

        timeout = setTimeout(async () => {
            const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=4&appid=${API_KEY}&lang=ru`;
            const res = await fetch(url);
            const data = await res.json();

            const seen = new Set();
            cities = [];

            for (let i = 0; i < data.length; i++) {
                const cityName = data[i]["local_names"]?.["en"] || data[i]["name"];
                const country = await getNameCityByCode(data[i]["country"]);
                if (seen.has(cityName)) continue;
                seen.add(cityName);
                cities[i] = {
                    'country': country,
                    'city': cityName,
                    'regional_city': data[i]["local_names"]?.["ru"] || data[i]["local_names"]?.["en"] || data[i]["name"],
                };
            }
            if (cities.length > 0) {
                suggestions.classList.add('show');
            }
            let citiesSize = cities.length;
            if (citiesSize > 4) {
                citiesSize = 4;
            }

            for (let j = 0; j < citiesSize; j++) {
                const blockSuggestCity = document.createElement("div");
                blockSuggestCity.className = "suggest__city";
                blockSuggestCity.innerHTML = `
                <div class="suggest__block-icon">
                    <svg fill="#000000" height="16px" width="16px" class="icon-suggest"
                    version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 512 512" xml:space="preserve">
        <g>
        \t<g>
        \t\t<path d="M109.192,59.037H72.62c-5.771,0-10.449,4.678-10.449,10.449v57.469c0,5.771,4.678,10.449,10.449,10.449h36.571
        \t\t\tc5.771,0,10.449-4.678,10.449-10.449V69.486C119.641,63.715,114.963,59.037,109.192,59.037z M98.743,116.506H83.069V79.935h15.673
        \t\t\tV116.506z"/>
        \t</g>
        </g>
        <g>
        \t<g>
        \t\t<path d="M182.335,59.037h-36.571c-5.771,0-10.449,4.678-10.449,10.449v57.469c0,5.771,4.678,10.449,10.449,10.449h36.571
        \t\t\tc5.771,0,10.449-4.678,10.449-10.449V69.486C192.784,63.715,188.106,59.037,182.335,59.037z M171.886,116.506h-15.673V79.935
        \t\t\th15.673V116.506z"/>
        \t</g>
        </g>
        <g>
        \t<g>
        \t\t<path d="M109.192,161.437H72.62c-5.771,0-10.449,4.678-10.449,10.449v57.469c0,5.771,4.678,10.449,10.449,10.449h36.571
        \t\t\tc5.771,0,10.449-4.678,10.449-10.449v-57.469C119.641,166.115,114.963,161.437,109.192,161.437z M98.743,218.906H83.069v-36.571
        \t\t\th15.673V218.906z"/>
        \t</g>
        </g>
        <g>
        \t<g>
        \t\t<path d="M182.335,161.437h-36.571c-5.771,0-10.449,4.678-10.449,10.449v57.469c0,5.771,4.678,10.449,10.449,10.449h36.571
        \t\t\tc5.771,0,10.449-4.678,10.449-10.449v-57.469C192.784,166.115,188.106,161.437,182.335,161.437z M171.886,218.906h-15.673v-36.571
        \t\t\th15.673V218.906z"/>
        \t</g>
        </g>
        <g>
        \t<g>
        \t\t<path d="M109.192,263.837H72.62c-5.771,0-10.449,4.678-10.449,10.449v57.469c0,5.771,4.678,10.449,10.449,10.449h36.571
        \t\t\tc5.771,0,10.449-4.678,10.449-10.449v-57.469C119.641,268.515,114.963,263.837,109.192,263.837z M98.743,321.306H83.069v-36.571
        \t\t\th15.673V321.306z"/>
        \t</g>
        </g>
        <g>
        \t<g>
        \t\t<path d="M182.335,263.837h-36.571c-5.771,0-10.449,4.678-10.449,10.449v57.469c0,5.771,4.678,10.449,10.449,10.449h36.571
        \t\t\tc5.771,0,10.449-4.678,10.449-10.449v-57.469C192.784,268.515,188.106,263.837,182.335,263.837z M171.886,321.306h-15.673v-36.571
        \t\t\th15.673V321.306z"/>
        \t</g>
        </g>
        <g>
        \t<g>
        \t\t<path d="M109.192,366.237H72.62c-5.771,0-10.449,4.678-10.449,10.449v57.469c0,5.771,4.678,10.449,10.449,10.449h36.571
        \t\t\tc5.771,0,10.449-4.678,10.449-10.449v-57.469C119.641,370.915,114.963,366.237,109.192,366.237z M98.743,423.706H83.069v-36.571
        \t\t\th15.673V423.706z"/>
        \t</g>
        </g>
        <g>
        \t<g>
        \t\t<path d="M182.335,366.237h-36.571c-5.771,0-10.449,4.678-10.449,10.449v57.469c0,5.771,4.678,10.449,10.449,10.449h36.571
        \t\t\tc5.771,0,10.449-4.678,10.449-10.449v-57.469C192.784,370.915,188.106,366.237,182.335,366.237z M171.886,423.706h-15.673v-36.571
        \t\t\th15.673V423.706z"/>
        \t</g>
        </g>
        <g>
        \t<g>
        \t\t<path d="M328.719,417.785h-0.137c-5.771,0-10.449,4.678-10.449,10.449c0,5.771,4.678,10.449,10.449,10.449h0.137
        \t\t\tc5.771,0,10.449-4.678,10.449-10.449C339.168,422.463,334.49,417.785,328.719,417.785z"/>
        \t</g>
        </g>
        <g>
        \t<g>
        \t\t<path d="M328.719,236.669h-0.137c-5.771,0-10.449,4.678-10.449,10.449c0,5.771,4.678,10.449,10.449,10.449h0.137
        \t\t\tc5.771,0,10.449-4.678,10.449-10.449C339.168,241.347,334.49,236.669,328.719,236.669z"/>
        \t</g>
        </g>
        <g>
        \t<g>
        \t\t<path d="M328.719,272.893h-0.137c-5.771,0-10.449,4.678-10.449,10.449c0,5.771,4.678,10.449,10.449,10.449h0.137
        \t\t\tc5.771,0,10.449-4.678,10.449-10.449C339.168,277.571,334.49,272.893,328.719,272.893z"/>
        \t</g>
        </g>
        <g>
        \t<g>
        \t\t<path d="M328.719,309.115h-0.137c-5.771,0-10.449,4.678-10.449,10.449c0,5.771,4.678,10.449,10.449,10.449h0.137
        \t\t\tc5.771,0,10.449-4.678,10.449-10.449C339.168,313.793,334.49,309.115,328.719,309.115z"/>
        \t</g>
        </g>
        <g>
        \t<g>
        \t\t<path d="M328.719,345.339h-0.137c-5.771,0-10.449,4.678-10.449,10.449c0,5.771,4.678,10.449,10.449,10.449h0.137
        \t\t\tc5.771,0,10.449-4.678,10.449-10.449C339.168,350.017,334.49,345.339,328.719,345.339z"/>
        \t</g>
        </g>
        <g>
        \t<g>
        \t\t<path d="M328.719,381.562h-0.137c-5.771,0-10.449,4.678-10.449,10.449s4.678,10.449,10.449,10.449h0.137
        \t\t\tc5.771,0,10.449-4.678,10.449-10.449S334.49,381.562,328.719,381.562z"/>
        \t</g>
        </g>
        <g>
        \t<g>
        \t\t<path d="M501.551,468.637h-8.359V126.955c0-5.771-4.678-10.449-10.449-10.449H357.355c-5.771,0-10.449,4.678-10.449,10.449v73.491
        \t\t\tH233.012V32.914c0-5.771-4.678-10.449-10.449-10.449H32.392c-5.771,0-10.449,4.678-10.449,10.449v435.722H10.449
        \t\t\tC4.678,468.637,0,473.315,0,479.086s4.678,10.449,10.449,10.449h472.294h18.808c5.771,0,10.449-4.678,10.449-10.449
        \t\t\tS507.322,468.637,501.551,468.637z M212.114,210.895v257.742H42.841V43.363h169.273V210.895z M346.906,468.637H233.012v-29.954
        \t\t\th61.765c5.771,0,10.449-4.678,10.449-10.449c0-5.771-4.678-10.449-10.449-10.449h-61.765v-15.326h61.765
        \t\t\tc5.771,0,10.449-4.678,10.449-10.449s-4.678-10.449-10.449-10.449h-61.765v-15.324h61.765c5.771,0,10.449-4.678,10.449-10.449
        \t\t\tc0-5.771-4.678-10.449-10.449-10.449h-61.765v-15.326h61.765c5.771,0,10.449-4.678,10.449-10.449
        \t\t\tc0-5.771-4.678-10.449-10.449-10.449h-61.765V293.79h61.765c5.771,0,10.449-4.678,10.449-10.449s-4.678-10.449-10.449-10.449
        \t\t\th-61.765v-15.325h61.765c5.771,0,10.449-4.678,10.449-10.449c0-5.771-4.678-10.449-10.449-10.449h-61.765v-15.326h113.894V468.637
        \t\t\tz M378.253,468.637h-10.449V210.895v-73.491h10.449V468.637z M409.6,468.637h-10.449V137.404H409.6V468.637z M440.947,468.637
        \t\t\th-10.449V137.404h10.449V468.637z M472.294,468.637h-10.449V137.404h10.449V468.637z"/>
        \t</g>
        </g>
        </svg>
                </div>
                <div class="suggest__block-main">
                    <div class="suggest__block-first">
                        <p class="suggest__block-first-city">${cities[j]['regional_city']}</p> 
                        <div class="suggest__block-first-wrap">                        
                            <p class="suggest__block-first-conditional">Город</p>
                        </div>

                    </div>
                    <div class="suggest__block-second">
                        <p class="suggest__block-second-text">${cities[j]['country']}</p>
                    </div>
                </div>
                `;
                blockSuggestCity.addEventListener("click", async () => {
                    try {
                        setRegion(cities[j]['city']);
                        searchInput.value = "";
                        suggestions.classList.remove('show');
                        suggestions.innerHTML = "";
                        cities = [];
                        await loadData(region);
                    } catch (e) {
                        geoError();
                    }

                })
                suggestions.append(blockSuggestCity);
            }
        }, 400)
    })
}

export function initCancelInput() {
    const btnCancel = document.querySelector(".search-cancel");
    const searchInput = document.querySelector('.header__search-input');
    btnCancel.addEventListener('click', () => {
        searchInput.value = '';
    })
}

