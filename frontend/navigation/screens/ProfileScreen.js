import * as React from "react";
import { useState, useEffect } from "react";

//components & styling
import { StyleSheet, View } from "react-native";
import { FAB, TextInput, Text } from "react-native-paper";
import CustomButton from "../../component/button";
import { colours } from "../../assets/colours";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as WebBrowser from "expo-web-browser";
import { BACKEND_BASE_URL } from "@env";

export default function ProfileScreen() {
  const navigationObj = useNavigation();

  const [changedUsername, setChangedUsername] = useState("");
  const [changedPassword, setChangedPassword] = useState("");

  function handleChangeUsername() {
    AsyncStorage.getItem("token")
      .then((token) => {
        fetch(BACKEND_BASE_URL + "/changeUsername", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ changedUsername }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            setVisible(false);
            return response.json();
          })
          .then((data) => {
            //ajnds
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      })
      .catch((error) => {
        console.error("Error retrieving token:", error);
      });
  }

  function handleChangePassword() {
    AsyncStorage.getItem("token")
      .then((token) => {
        fetch(BACKEND_BASE_URL + "/changePassword", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ changedPassword }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            setVisible(false);
            return response.json();
          })
          .then((data) => {
            //ajnds
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      })
      .catch((error) => {
        console.error("Error retrieving token:", error);
      });
  }

  function _handlePressButtonAsync(website) {
    if (website === "Github") {
      WebBrowser.openBrowserAsync(
        "https://github.com/Oriyans-sunset/RSS-Reader"
      );
    }
  }

  return (
    <View style={styles.MainContainer}>
      <View style={styles.inputBoxes}>
        <TextInput
          label={
            <Text style={{ fontFamily: "notoSerif" }}>Enter New Username</Text>
          }
          onChangeText={setChangedUsername}
          value={changedUsername}
          mode="outlined"
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
        <CustomButton
          onPress={handleChangeUsername}
          label="Change Username"
          isLoading={false}
          colour={colours.yellow}
        ></CustomButton>
        <TextInput
          label={
            <Text style={{ fontFamily: "notoSerif" }}>Enter New Password</Text>
          }
          mode="outlined"
          onChangeText={setChangedPassword}
          value={changedPassword}
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
        <CustomButton
          onPress={handleChangePassword}
          label="Change Password"
          isLoading={false}
          colour={colours.yellow}
        ></CustomButton>
      </View>
      <View style={styles.aboutSection}>
        <CustomButton
          onPress={() => {}}
          label="Third Party Licenses"
          isLoading={false}
          colour={colours.yellow}
        ></CustomButton>
        <CustomButton
          onPress={() => _handlePressButtonAsync("Github")}
          label="Github"
          isLoading={false}
          colour={colours.yellow}
        ></CustomButton>
      </View>
      <Text>Made by Priyanshu Rastogi</Text>
      <FAB
        icon="arrow-left"
        style={styles.fab}
        onPress={() => navigationObj.goBack()}
        color={colours.black}
        backgroundColor={colours.peach}
      />
    </View>
  );
}
const shadowBaseStyle = {
  elevation: 4, // Add elevation for shadow
  shadowOffset: { width: 0, height: 2 }, // Customize shadow offset if needed
  shadowRadius: 4, // Customize shadow radius if needed
};

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: colours.lightBlue,
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 20,
  },
  inputBoxes: {
    backgroundColor: colours.lightBeige,
    borderRadius: 10,
    width: "100%",
    height: "60%",
    justifyContent: "space-evenly",
    padding: 20,
  },
  aboutSection: {
    width: "100%",
    height: "20%",
    justifyContent: "space-between",
    alignItems: "center",
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
