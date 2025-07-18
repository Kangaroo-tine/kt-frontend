import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgEmotionIcon = ({ color = "#A6A6A6", ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" fill="none" {...props}>
    <Path
      fill={color}
      d="M23 21a1 1 0 0 1-1-1v-5C21.449 1.73 2.546 1.74 2 15v5a1 1 0 1 1-2 0v-5C.661-.924 23.345-.911 24 15v5a1 1 0 0 1-1 1Zm-3-1v-5C19.6 4.4 4.4 4.407 4 15v5a1 1 0 1 0 2 0v-5c.253-7.932 11.75-7.926 12 0v5a1 1 0 0 0 2 0Zm-4 0v-5a4 4 0 0 0-8 0v5a1 1 0 1 0 2 0v-5a2 2 0 0 1 4 0v5a1 1 0 0 0 2 0Z"
    />
  </Svg>
)
export default SvgEmotionIcon