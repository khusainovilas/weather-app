import './styles/style.css';
import {loadData} from "./modules/dom.js";
import {getRegionFromCoords, setRegion, btnLocation, region} from "./modules/location.js";
import {initCancelInput, initInput, initNavigation, initThemeBtn, initUpdateBtn} from "./modules/event.js";
import {initSearchInput} from "./modules/search.js";
import {geoError} from "./modules/error.js";



document.addEventListener('DOMContentLoaded', async () => {
    initNavigation();
    initUpdateBtn();
    initThemeBtn();
    initCancelInput();

    await initInput();
    await initSearchInput();
    await loadData(region);


    btnLocation.addEventListener('click', async () => {
        if (!navigator.geolocation) {
            return;
        }

        navigator.geolocation.getCurrentPosition(success, error);

        async function success(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            try {
                setRegion(await getRegionFromCoords(latitude, longitude));
                await loadData(region);
                console.log(region);
            } catch (e) {
                console.error(e);
            }
        }

        function error() {
            geoError();
        }
    });
})
