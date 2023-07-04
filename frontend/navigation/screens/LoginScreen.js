import * as React from "react";
import { StyleSheet, View, ImageBackground } from "react-native";
import { colours } from "../../assets/colours";
import { Text, TextInput, Button } from "react-native-paper";

function LoginScreen({ navigation }) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const image = require("../../assets/images/login-background.jpg");

  async function handleLogin() {
    try {
      const response = await fetch(
        "https://rss-reader-backend.onrender.com/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      // Handle the response from your backend here
      // For example, you can check the response status and navigate to another screen if successful
      if (response.ok) {
        console.log("Login successful.");
        navigation.navigate("Home");
      } else {
        // Handle authentication error
        console.log("Login failed.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function handleRegister() {
    try {
      const response = await fetch(
        "https://rss-reader-backend.onrender.com/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      // Handle the response from your backend here
      // For example, you can check the response status and navigate to another screen if successful
      if (response.ok) {
        console.log("Registration successful.");
        navigation.navigate("Home");
      } else if (response.status === 400) {
        // Handle authentication error
        console.log("User already exists.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <View style={styles.mainContainer}>
      <ImageBackground source={image} style={styles.image}>
        <View style={styles.formBox}>
          <Text variant="displayMedium">Welcome To {"\n"} RSS Reader</Text>
          <View style={styles.inputBox}>
            <TextInput
              placeholder="Username/Email"
              placeholderTextColor={"black"}
              backgroundColor={colours.blue}
              borderRadius={11}
              underlineColor={colours.white}
              value={username}
              onChangeText={(username) => setUsername(username)}
            ></TextInput>
            <TextInput
              placeholder="Password"
              backgroundColor={colours.blue}
              borderRadius={11}
              mode="flat"
              underlineColor={colours.white}
              placeholderTextColor={"black"}
              value={password}
              onChangeText={(password) => setPassword(password)}
            ></TextInput>
            <Button
              buttonColor={colours.darkBlue}
              mode="contained"
              onPress={handleLogin}
            >
              <Text variant="titleMedium">Log In</Text>
            </Button>

            <Button
              buttonColor={colours.darkBlue}
              mode="contained"
              onPress={handleRegister}
            >
              <Text variant="titleMedium">Register</Text>
            </Button>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formBox: {
    backgroundColor: colours.white,
    opacity: 0.8,
    width: "82%",
    height: "70%",
    padding: 10,
    justifyContent: "space-evenly",
    borderRadius: 11,
  },
  inputBox: {
    height: "80%",
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
});
export default LoginScreen;
