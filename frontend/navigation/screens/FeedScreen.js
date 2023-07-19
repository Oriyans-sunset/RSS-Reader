import * as React from "react";
import { useEffect, useState } from "react";

//components & styling
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from "react-native";
import { colours } from "../../assets/colours";
import { Appbar, FAB, List } from "react-native-paper";

//3rd party libraries
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";

//envirnoemnt variables
import { BACKEND_BASE_URL } from "@env";

export default function FeedScreen({ route, navigation }) {
  const { url, name } = route.params;

  const [articles, setArticles] = React.useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const navigationObject = useNavigation();

  function getArticles() {
    AsyncStorage.getItem("token")
      .then((token) => {
        fetch(BACKEND_BASE_URL + "/articles", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            url: url,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
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
          elevation: 4,
          shadowColor: colours.darkBlue,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.5,
          shadowRadius: 4,
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
                shadowColor: colours.black,
                shadowOpacity: 0.3,
                ...shadowBaseStyle,
              }}
            />
          </TouchableOpacity>
        )}
      />
      <FAB
        icon="arrow-left"
        style={styles.fab}
        onPress={() => {
          navigationObject.goBack();
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }}
        color={colours.black}
        backgroundColor={colours.peach}
      />
    </View>
  );
}
const shadowBaseStyle = {
  elevation: 4,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
};

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
    shadowColor: colours.peach,
    shadowOpacity: 0.9,
    ...shadowBaseStyle,
  },
});
