import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import backArrowImg from "../../assets/icons/back_icon.png";

export default function BackButton() {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.back()}>
      <Image source={backArrowImg} style={{ width: 20, height: 20 }} />
    </TouchableOpacity>
  );
}
