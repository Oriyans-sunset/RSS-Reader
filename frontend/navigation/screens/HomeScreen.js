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
import CustomButton from "../../component/button";
import LottieView from "lottie-react-native"; // Import LottieView

export default function HomeScreen({ navigation }) {
  const [visible, setVisible] = React.useState(false);
  const [website, setWebsite] = React.useState("");
  const [listData, setListData] = React.useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [animation, setAnimation] = useState(true);

  function getWebsites() {
    AsyncStorage.getItem("token")
      .then((token) => {
        fetch("https://rss-reader-backend.onrender.com:3000/websites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            setAnimation(false);
            setListData(data);
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
    getWebsites();
  };
  useEffect(() => {
    console.log("use effect called");

    getWebsites();
  }, [website]);

  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    width: "87%",
    height: "25%",
    alignSelf: "center",
    borderRadius: 10,
    flexDirection: "column",
    justifyContent: "space-between",
  };

  async function handleAddWebsite() {
    //send fetch request to backend for feed data

    AsyncStorage.getItem("token")
      .then((token) => {
        console.log(token);
        console.log(website);
        fetch("http://192.168.1.8:3000/websites", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ website }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            setVisible(false);
            return response.json();
          })
          .then((data) => {
            console.log(data);
            setListData([...listData, website]);
            setWebsite(null);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      })
      .catch((error) => {
        console.error("Error retrieving token:", error);
      });
  }
  function openFeed(item) {
    console.log(item.url, "hello");
    navigation.navigate("Feed", { url: item.url, name: item.name });
  }
  if (animation) {
    return (
      <LottieView
        source={require("../../assets/animations/loading-animation.json")}
        backgroundColor="#a9e8f5"
        autoPlay
        loop
      />
    );
  } else {
    return (
      <PaperProvider>
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
              title="Library"
              color={colours.darkBlue}
              titleStyle={{
                fontSize: 35,
                fontWeight: "bold",
                fontFamily: "lobster",
                paddingBottom: 8,
                paddingTop: 15,
              }}
            />
            <Appbar.Action
              icon="account-circle"
              size={30}
              color={colours.darkBlue}
              onPress={() => {}}
            />
          </Appbar.Header>
          <FlatList
            padding={10}
            marginTop={2}
            marginBottom={5}
            data={listData}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => openFeed(item)}>
                <List.Item
                  title={item.name}
                  titleStyle={{
                    color: colours.almostBlack,
                    fontFamily: "notoSerif",
                  }}
                  descriptionStyle={{
                    color: colours.grey,
                    fontFamily: "notoSerif",
                  }}
                  description={item.numberOfArticles}
                  style={{
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
                  left={() => (
                    <Avatar.Image
                      resizeMode="contain"
                      source={{ uri: item.icon }}
                      size={45}
                    />
                  )}
                />
              </TouchableOpacity>
            )}
          />
          <Portal>
            <Modal
              visible={visible}
              onDismiss={() => setVisible(false)}
              contentContainerStyle={containerStyle}
            >
              <View style={styles.inputBoxs}>
                <TextInput
                  label={
                    <Text style={{ fontFamily: "notoSerif" }}>
                      Enter RSS Feed URL*
                    </Text>
                  }
                  mode="outlined"
                  value={website}
                  onChangeText={(website) => setWebsite(website)}
                  textColor={colours.black}
                  style={{
                    backgroundColor: colours.white,
                    marginBottom: 10,
                    borderRadius: 10,
                    elevation: 4, // Add elevation for shadow
                    shadowColor: colours.black, // Customize shadow color if needed
                    shadowOffset: { width: 0, height: 2 }, // Customize shadow offset if needed
                    shadowOpacity: 0.1, // Customize shadow opacity if needed
                    shadowRadius: 4, // Customize shadow radius if needed
                  }}
                  theme={{
                    colors: {
                      primary: colours.yellow,
                    },
                  }}
                />
              </View>

              <View style={styles.modalButtons}>
                <CustomButton
                  onPress={() => setVisible(false)}
                  label="Cancel"
                  isLoading={false}
                  colour={colours.darkBlue}
                ></CustomButton>
                <CustomButton
                  onPress={handleAddWebsite}
                  label="Add Website"
                  isLoading={false}
                  colour={colours.yellow}
                ></CustomButton>
              </View>
            </Modal>
          </Portal>
          <FAB
            icon="plus"
            style={styles.fab}
            onPress={() => setVisible(true)}
            color={colours.black}
            backgroundColor={colours.peach}
          />
          <View style={styles.content}></View>
        </View>
      </PaperProvider>
    );
  }
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
    shadowRadius: 4, // Customize shadow radius if needed
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputBoxs: {
    height: "50%",
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
});
