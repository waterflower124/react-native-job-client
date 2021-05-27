import { Dimensions } from "react-native"
const { width: screenWidth, height: screenHeight } = Dimensions.get("window")
const guidelineBaseWidth = 375
const guidelineBaseHeight = 667
/**
 * Screen Width
 */
const sWidth = screenWidth

/**
 * Screen Height
 */
const sHeight = screenHeight

/**
 * Horizontal Size Scale
 * @param {number} size 
 */
const hScale = (size: number) => (sWidth / guidelineBaseWidth) * size

/**
 * Vertical Size Scale
 * @param {number} size 
 */
const vScale = (size: number) => (screenHeight / guidelineBaseHeight) * size


/**
 * Font Size Scale
 * @param {number} size 
 * @param {number} [factor] 
 */
const fScale = (size: number, factor: number = 0.5) => size + (hScale(size) - size) * factor

export { sHeight, sWidth, hScale, vScale, fScale }