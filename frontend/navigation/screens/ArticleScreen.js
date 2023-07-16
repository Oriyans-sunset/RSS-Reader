import * as React from "react";
import { StyleSheet, View, StatusBar, SafeAreaView } from "react-native";
import { WebView } from "react-native-webview";
import { colours } from "../../assets/colours";
import { FAB } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";

export default function ArticleScreen({ route }) {
  const { url } = route.params;
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: url }}
        style={styles.webView}
        renderLoading={() => (
          <LottieView
            source={require("../../assets/animations/loading-animation.json")}
            backgroundColor={colours.lightBlue}
            autoPlay
            loop
          />
        )}
        startInLoadingState
      />
      <FAB
        icon="arrow-left"
        style={styles.fab}
        onPress={() => navigation.goBack()}
        color={colours.black}
        backgroundColor={colours.peach}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  webView: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    marginRight: 16,
    marginBottom: 25,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colours.peach,
    right: 0,
    bottom: 0,
    elevation: 4, // Add elevation for shadow
    shadowColor: colours.peach, // Customize shadow color if needed
    shadowOffset: { width: 0, height: 2 }, // Customize shadow offset if needed
    shadowOpacity: 0.9, // Customize shadow opacity if needed
    shadowRadius: 4, // Customize shadow radius if needed},
  },
});
