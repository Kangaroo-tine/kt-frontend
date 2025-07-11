import { Dimensions } from "react-native";

//이 함수를 사용할지 말지는 팀원끼리 논의가 필요함.

//디자인 기준 화면 사이즈 (가로)
const baseWidth = 361;
//디자인 기준 화면 사이즈 (세로)
const baseHeight = 752;

const { width, height } = Dimensions.get("window");

/**
 * 모바일 화면 가로 크기에 맞게 조절된 사이즈를 반환 해주는 함수
 * @param size 디자인 기준 개체 사이즈(px)
 * @returns 화면 비율에 맞게 조절된 크기를 반환
 */

export function responsiveW(size: number) {
  return size * width / baseWidth;
}

/**
 * 모바일 화면 세로 크기에 맞게 조절된 사이즈를 반환 해주는 함수
 * @param size 디자인 기준 개체 사이즈(px)
 * @returns 화면 비율에 맞게 조절된 크기를 반환
 */

export function responsiveH(size: number) {
  return size * height / baseHeight;
}