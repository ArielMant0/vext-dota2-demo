function getHeroSrc(name) {
    return `images/heroes/${name.replaceAll(" ", "_")}_icon.png`
}
function getAttributeSrc(attribute) {
    return `images/${attribute}_attribute_symbol.png`
}
function getLogoSrc() {
    return `images/Dota_2_logo.png`
}
function isMobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        console.log("hello")
        return window.matchMedia("only screen and (max-width: 760px)").matches
    }
    return false;
}

export { getHeroSrc, getAttributeSrc, getLogoSrc, isMobile }