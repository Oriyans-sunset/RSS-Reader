import * as React from "react";
import { useState } from "react";
import MainContainer from "./navigation/MainContainer";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import { RootSiblingParent } from "react-native-root-siblings";

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
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontsLoaded(true)}
        onError={(err) => console.log(err)}
      />
    );
  }

  return (
    <RootSiblingParent>
      <MainContainer></MainContainer>
    </RootSiblingParent>
  );
}
