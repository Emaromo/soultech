/**
 * Dimensiones de tarjeta compartidas entre ServicesSection y IndustryGrid,
 * para que dejen de divergir en tamaño. Tomadas como referencia las del
 * carrusel de rubros (las más grandes). Un solo lugar para ajustarlas.
 */
export const CARD_WIDTH_DESKTOP = "min(340px,80vw)";
export const CARD_WIDTH_MOBILE = "min(260px,86vw)";
export const CARD_ASPECT_RATIO = "5/7";
export const CARD_PADDING = 26;
export const CARD_GAP_MULT_DESKTOP = 0.9;
export const CARD_GAP_MULT_MOBILE = 1.05;
export const CARD_TRACK_HEIGHT_DESKTOP = 560;
export const CARD_TRACK_HEIGHT_MOBILE = 420;

export const cardWidthFor = (isMobile) => (isMobile ? CARD_WIDTH_MOBILE : CARD_WIDTH_DESKTOP);
export const cardGapMultFor = (isMobile) => (isMobile ? CARD_GAP_MULT_MOBILE : CARD_GAP_MULT_DESKTOP);
export const cardTrackHeightFor = (isMobile) => (isMobile ? CARD_TRACK_HEIGHT_MOBILE : CARD_TRACK_HEIGHT_DESKTOP);
