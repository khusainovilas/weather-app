export function geoError() {
    const mainContent = document.querySelector('.main__content');
    const errorContent = document.querySelector('.block__error-message');
    if (mainContent.classList.contains('show')) {
        mainContent.classList.remove('show');
        errorContent.classList.add('show');
    }
}

export function connectionError() {
    const mainContent = document.querySelector('.main__content');
    const connectionContent = document.querySelector('.block__connection-message');
    if (mainContent.classList.contains('show')) {
        mainContent.classList.remove('show');
        connectionContent.classList.add('show');
    }
}