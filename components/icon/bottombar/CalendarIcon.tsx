import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
const SvgCalendarIcon = ({ color = "#A6A6A6", ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" fill="none" {...props}>
    <G fill={color} clipPath="url(#a)">
      <Path d="M19 2h-1V1a1 1 0 0 0-2 0v1H8V1a1 1 0 0 0-2 0v1H5a5.006 5.006 0 0 0-5 5v12a5.006 5.006 0 0 0 5 5h14a5.006 5.006 0 0 0 5-5V7a5.006 5.006 0 0 0-5-5ZM2 7a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v1H2V7Zm17 15H5a3 3 0 0 1-3-3v-9h20v9a3 3 0 0 1-3 3Z" />
      <Path d="M12 16.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM7 16.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM17 16.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgCalendarIcon