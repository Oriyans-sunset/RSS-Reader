import * as React from "react";
import { useEffect, useState } from "react";
import { StyleSheet, View, ImageBackground, Text } from "react-native";
import { colours } from "../../assets/colours";
import { TextInput, Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../../component/button";

function LoginScreen({ navigation }) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [isLoading, setLoading] = React.useState(false);

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
      setLoading(true);
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
        navigation.navigate("Home");
        setLoading(false);
      } else {
        // Handle authentication error
        console.log("Login failed.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function handleRegister() {
    try {
      setLoading(true);
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
        const data = await response.json();
        const token = data.token;
        console.log("Registration successful.");
        await AsyncStorage.setItem("token", token);
        navigation.navigate("Home");
        setLoading(false);
      } else if (response.status === 400) {
        // Handle authentication error
        console.log("User already exists.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <View style={styles.mainContainer}>
      <ImageBackground source={image} style={styles.image}>
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
                <Text style={{ fontFamily: "notoSerif" }}>Enter Password</Text>
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
              isLoading={isLoading}
              colour={colours.yellow}
            />
            <CustomButton
              onPress={handleRegister}
              label="Register"
              isLoading={isLoading}
              colour={colours.darkBlue}
            />
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
