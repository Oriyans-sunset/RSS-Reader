import * as React from "react";
import { useEffect, useState } from "react";
import { StyleSheet, View, ImageBackground, Text } from "react-native";
import { colours } from "../../assets/colours";
import { TextInput, Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../../component/button";
import LottieView from "lottie-react-native"; // Import LottieView
import Toast from "react-native-root-toast";

function LoginScreen({ navigation }) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [isLoadingLogin, setLoadingLogin] = React.useState(false);
  const [isLoadingRegister, setLoadingRegister] = React.useState(false);

  const [isImageLoading, setImageLoading] = useState(true);

  const image = require("../../assets/images/login-background.jpg");

  useEffect(() => {
    async function checkIfLoggedIn() {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        // Token exists, navigate to home screen
        //navigation.navigate("Home");
      }
    }
    checkIfLoggedIn();
  }, []);

  async function handleLogin() {
    try {
      setLoadingLogin(true);
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

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        console.log("Login successful.", token);
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("username", username);
        navigation.navigate("Home");
        setLoadingLogin(false);
      } else {
        // Handle authentication error
        Toast.show("Login failed. Check your username or password.", {
          position: Toast.positions.TOP + 15,
          duration: Toast.durations.LONG,
        });
        setLoadingLogin(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function handleRegister() {
    try {
      setLoadingRegister(true);
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

      // Handle the response from backend
      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        console.log("Registration successful.");
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("username", username);
        navigation.navigate("Home");
        setLoadingRegister(false);
      } else if (response.status === 400) {
        // Handle authentication error
        Toast.show("User already exists.", {
          position: Toast.positions.TOP + 15,
          duration: Toast.durations.LONG,
        });
        setLoadingRegister(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  function showAnimation(value) {
    setImageLoading(value);
  }
  return (
    <View style={styles.mainContainer}>
      {isImageLoading && (
        <LottieView
          source={require("../../assets/animations/loading-animation.json")}
          autoPlay
          loop
        />
      )}
      {
        <ImageBackground
          source={image}
          style={styles.image}
          onLoadStart={() => showAnimation(true)}
          onLoadEnd={() => showAnimation(false)}
        >
          <View style={styles.formBox}>
            <Text style={{ fontSize: 40, fontFamily: "lobster" }}>
              Welcome To {"\n"} RSS Reader
            </Text>
            <View style={styles.inputBox}>
              <TextInput
                label={
                  <Text style={{ fontFamily: "notoSerif" }}>
                    Enter Email/Username
                  </Text>
                }
                value={username}
                onChangeText={setUsername}
                mode="flat"
                underlineStyle={{ width: 0 }}
                style={{
                  backgroundColor: colours.white,
                  marginBottom: 10,
                  borderRadius: 10,
                }}
                theme={{
                  colors: {
                    primary: colours.blue,
                  },
                }}
              />
              <TextInput
                label={
                  <Text style={{ fontFamily: "notoSerif" }}>
                    Enter Password
                  </Text>
                }
                value={password}
                onChangeText={setPassword}
                mode="flat"
                underlineStyle={{ width: 0 }}
                secureTextEntry
                style={{
                  backgroundColor: colours.white,
                  marginBottom: 10,
                  borderRadius: 10,
                }}
                theme={{
                  colors: {
                    primary: colours.blue,
                  },
                }}
              />
              <CustomButton
                onPress={handleLogin}
                label="Login"
                isLoading={isLoadingLogin}
                colour={colours.yellow}
              />
              <CustomButton
                onPress={handleRegister}
                label="Register"
                isLoading={isLoadingRegister}
                colour={colours.darkBlue}
              />
            </View>
          </View>
        </ImageBackground>
      }
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
    backgroundColor: "rgba(255, 255, 255, 0.8)",
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
