function getHeroSrc(name) {
    return `/images/heroes/${name.replaceAll(" ", "_")}_icon.png`
}
function getAttributeSrc(attribute) {
    return `/images/${attribute}_attribute_symbol.png`
}
function getLogoSrc() {
    return `/images/Dota_2_logo.png`
}

export { getHeroSrc, getAttributeSrc, getLogoSrc }