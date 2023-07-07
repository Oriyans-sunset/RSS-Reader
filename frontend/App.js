import * as React from "react";
import { useState } from "react";
import { useCallback } from "react";
import MainContainer from "./navigation/MainContainer";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import {
  useFonts,
  Nunito_400Regular,
  Lato_400Regular,
  Inter_900Black,
} from "@expo-google-fonts/dev";

//SplashScreen.preventAutoHideAsync();

const fetchFonts = () => {
  return Font.loadAsync({
    lobster: require("./assets/fonts/Lobster-Regular.ttf"),
    notoSerif: require("./assets/fonts/NotoSerif.ttf"),
    notoSerifBold: require("./assets/fonts/NotoSerif-Bold.ttf"),
  });
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  if (!fontsLoaded) {
    console.log("Loading fonts...");
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontsLoaded(true)}
        onError={(err) => console.log(err)}
      />
    );
  }

  return <MainContainer></MainContainer>;
}
