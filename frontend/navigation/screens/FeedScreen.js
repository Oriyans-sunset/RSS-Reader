import * as React from "react";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  FlatList,
  Text,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from "react-native";
import { colours } from "../../assets/colours";
import { WebView } from "react-native-webview";
import {
  Modal,
  Portal,
  Button,
  Appbar,
  FAB,
  PaperProvider,
  TextInput,
  List,
  Avatar,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function FeedScreen({ route, navigation }) {
  const { url, name } = route.params;

  const [articles, setArticles] = React.useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const navigationObject = useNavigation();

  function getArticles() {
    AsyncStorage.getItem("token")
      .then((token) => {
        const requestBody = {
          url: url,
        };

        fetch("https://rss-reader-backend.onrender.com/articles", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify(requestBody),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            //console.log(data);
            setArticles(data);
            setRefreshing(false);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      })
      .catch((error) => {
        console.error("Error retrieving token:", error);
      });
  }
  const onRefresh = () => {
    setRefreshing(true);
    getArticles();
  };
  useEffect(() => {
    getArticles();
  }, []);

  function openArticle(item) {
    navigation.navigate("Article", { url: item.url });
  }

  return (
    <View style={styles.MainContainer}>
      <StatusBar barStyle="dark-content" />
      <Appbar.Header
        style={{
          backgroundColor: colours.lightBeige,
          borderBottomLeftRadius: 3,
          borderBottomRightRadius: 3,
          borderBottomWidth: 4,
          borderColor: colours.darkBlue,
          elevation: 4, // Add elevation for shadow
          shadowColor: colours.darkBlue, // Customize shadow color if needed
          shadowOffset: { width: 0, height: 8 }, // Customize shadow offset if needed
          shadowOpacity: 0.5, // Customize shadow opacity if needed
          shadowRadius: 4, // Customize shadow radius if needed
        }}
      >
        <Appbar.Content
          title={name}
          color={colours.darkBlue}
          titleStyle={{
            fontSize: 24,
            backgroundColor: colours.lightBeige,
            fontWeight: "bold",
            fontFamily: "lobster",
            paddingBottom: 8,
            paddingTop: 15,
          }}
        />
      </Appbar.Header>
      <FlatList
        padding={10}
        marginTop={2}
        marginBottom={5}
        data={articles}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openArticle(item)}>
            <List.Item
              title={item.title}
              titleStyle={{
                color: colours.almostBlack,
                fontFamily: "notoSerif",
              }}
              titleNumberOfLines={5}
              descriptionStyle={{
                color: colours.grey,
                fontFamily: "notoSerif",
              }}
              description={item.date}
              style={{
                width: "100%",
                backgroundColor: colours.lightBeige,
                borderColor: colours.black,
                borderWidth: 2,
                padding: 10,
                borderRadius: 10,
                marginBottom: 10,
                elevation: 4, // Add elevation for shadow
                shadowColor: colours.black, // Customize shadow color if needed
                shadowOffset: { width: 0, height: 2 }, // Customize shadow offset if needed
                shadowOpacity: 0.3, // Customize shadow opacity if needed
                shadowRadius: 4, // Customize shadow radius if needed
              }}
            />
          </TouchableOpacity>
        )}
      />
      <FAB
        icon="arrow-left"
        style={styles.fab}
        onPress={() => navigationObject.goBack()}
        color={colours.black}
        backgroundColor={colours.peach}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: colours.lightBeige,
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
