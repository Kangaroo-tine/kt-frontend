import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

//{ color = "#A6A6A6", ...props } 이걸 통해 props로 아이콘 색상 변경가
const SvgHomeIcon = ({ color = "#A6A6A6", ...props }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" fill="none" {...props}>
    <G fill={color} clipPath="url(#a)">
      <Path d="M17 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM8 11a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" />
      <Path d="M21.59 6.7 13.752.85a4.959 4.959 0 0 0-5.708.11 19.887 19.887 0 0 0-6.943 9.61 1.082 1.082 0 0 0-.032.155c-.11.216-.205.44-.283.67a13.86 13.86 0 0 0 0 9.212A5 5 0 0 0 5.526 24H9.15a2.039 2.039 0 0 0 1.922-1.457 1.51 1.51 0 0 1 2.858 0A2.04 2.04 0 0 0 15.852 24H19a5.006 5.006 0 0 0 5-5v-7.493A6.026 6.026 0 0 0 21.59 6.7ZM9.24 2.562a2.94 2.94 0 0 1 3.36-.08L19.99 8H5.527c-.39 0-.777.045-1.156.135a18.189 18.189 0 0 1 4.87-5.573ZM22 19a3 3 0 0 1-3 3l-3.165-.066A3.511 3.511 0 0 0 9.15 22H5.526a3 3 0 0 1-2.843-2.038 11.869 11.869 0 0 1 0-7.923A3.006 3.006 0 0 1 5.527 10H21.7c.196.479.298.99.3 1.507V19Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgHomeIcon