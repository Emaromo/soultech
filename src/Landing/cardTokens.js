/**
 * Dimensiones de tarjeta compartidas entre ServicesSection y IndustryGrid,
 * para que dejen de divergir en tamaño. Tomadas como referencia las del
 * carrusel de rubros (las más grandes). Un solo lugar para ajustarlas.
 */
export const CARD_WIDTH_DESKTOP = "min(340px,80vw)";
export const CARD_WIDTH_MOBILE = "min(260px,86vw)";
// Desktop intacto: "5/7" da lugar de sobra al contenido con CARD_WIDTH_DESKTOP.
export const CARD_ASPECT_RATIO = "5/7";
// Mobile: a 260px de ancho, "5/7" da 364px de alto — medido con el
// contenido real (Playwright, aspectRatio:auto), Servicios necesita
// 430.8px y Rubros 400.2px a ese ancho. 0.58 (=260/448) da margen a las
// dos con el mismo token compartido, sin tocar el ratio de desktop.
export const CARD_ASPECT_RATIO_MOBILE = "0.58";
export const CARD_PADDING = 26;
export const CARD_GAP_MULT_DESKTOP = 0.9;
export const CARD_GAP_MULT_MOBILE = 1.05;
export const CARD_TRACK_HEIGHT_DESKTOP = 560;
// 480 = alto real de la tarjeta con CARD_ASPECT_RATIO_MOBILE (~448px) + aire
// para el tilt/rotateX y los dots debajo, sin cortar contenido.
export const CARD_TRACK_HEIGHT_MOBILE = 480;

export const cardWidthFor = (isMobile) => (isMobile ? CARD_WIDTH_MOBILE : CARD_WIDTH_DESKTOP);
export const cardAspectRatioFor = (isMobile) => (isMobile ? CARD_ASPECT_RATIO_MOBILE : CARD_ASPECT_RATIO);
export const cardGapMultFor = (isMobile) => (isMobile ? CARD_GAP_MULT_MOBILE : CARD_GAP_MULT_DESKTOP);
export const cardTrackHeightFor = (isMobile) => (isMobile ? CARD_TRACK_HEIGHT_MOBILE : CARD_TRACK_HEIGHT_DESKTOP);
