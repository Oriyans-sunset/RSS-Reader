import * as React from "react";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
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
  Appbar,
  FAB,
  PaperProvider,
  TextInput,
  List,
  Avatar,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../../component/button";
import AnimationView from "../../component/animation";

export default function HomeScreen({ navigation }) {
  //data hooks
  const [website, setWebsite] = React.useState("");
  const [listData, setListData] = React.useState([]);

  //accessory hooks
  const [visible, setVisible] = React.useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [animation, setAnimation] = useState(true);

  //gets all the websites from the backend
  function getWebsites() {
    AsyncStorage.getItem("token")
      .then((token) => {
        fetch("https://rss-reader-backend.onrender.com/websites", {
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
            setListData(data);
            setAnimation(false);
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
    getWebsites();
  }, [website]);

  //send the new website to add to the backend
  async function handleAddWebsite() {
    AsyncStorage.getItem("token")
      .then((token) => {
        fetch("https://rss-reader-backend.onrender.com/websites", {
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

  if (animation) {
    return <AnimationView></AnimationView>;
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
              onPress={() => {
                navigation.navigate("Profile");
              }}
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
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Feed", {
                    url: item.url,
                    name: item.name,
                  })
                }
              >
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
                    ...shadowBaseStyle,
                    shadowOpacity: 0.5,
                    shadowColor: colours.black,
                    backgroundColor: colours.lightBeige,
                    borderColor: colours.black,
                    borderWidth: 2,
                    padding: 10,
                    borderRadius: 10,
                    marginBottom: 10,
                  }}
                  left={() => (
                    <Avatar.Image
                      resizeMode="contain"
                      source={{
                        uri: item.icon
                          ? item.icon
                          : "https://www.freeiconspng.com/uploads/no-image-icon-4.png",
                      }}
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
              contentContainerStyle={styles.containerStyle}
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
                    ...shadowBaseStyle,
                    backgroundColor: colours.white,
                    marginBottom: 10,
                    borderRadius: 10,
                    shadowColor: colours.black, // Customize shadow color if needed
                    shadowOpacity: 0.2, // Customize shadow opacity if needed
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
const shadowBaseStyle = {
  elevation: 4, // Add elevation for shadow
  shadowOffset: { width: 0, height: 2 }, // Customize shadow offset if needed
  shadowRadius: 4, // Customize shadow radius if needed
};

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: colours.lightBeige,
  },
  containerStyle: {
    backgroundColor: colours.lightBeige,
    padding: 20,
    width: "87%",
    height: "25%",
    alignSelf: "center",
    borderRadius: 10,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  fab: {
    ...shadowBaseStyle,
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
