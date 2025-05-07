/** @type {import('tailwindcss').Config} */
module.exports = {
    presets: [require('nativewind/preset')],
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          pretendard: ['Pretendard'],
          pretendardBold: ['PretendardBold'],
          pretendardLight: ['PretendardLight'],
          pretendardMedium: ['PretendardMedium'],
          pretendardSemiBold: ['PretendardSemiBold'],
          pretendardExtraBold: ['PretendardExtraBold'],
          pretendardBlack: ['PretendardBlack'],
          pretendardThin: ['PretendardThin'],
          pretendardExtraLight: ['PretendardExtraLight'],
        },
      },
    },
    plugins: [],
  }