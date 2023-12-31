import * as React from "react";

//components & styling
import { StyleSheet, StatusBar, SafeAreaView } from "react-native";
import { WebView } from "react-native-webview";
import { colours } from "../../assets/colours";
import { FAB } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AnimationView from "../../component/animation";

//3rd party libraries
import * as Haptics from "expo-haptics";
import Toast from "react-native-root-toast";

export default function ArticleScreen({ route }) {
  const { url } = route.params;
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: url }}
        style={styles.webView}
        renderLoading={() => <AnimationView></AnimationView>}
        onLoadStart={() => {
          Toast.show("This might take some time.", {
            position: Toast.positions.TOP + 15,
            duration: Toast.durations.LONG,
            backgroundColor: colours.black,
            opacity: 1,
          });
        }}
        startInLoadingState
      />
      <FAB
        icon="arrow-left"
        style={styles.fab}
        onPress={() => {
          navigation.goBack();
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }}
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
