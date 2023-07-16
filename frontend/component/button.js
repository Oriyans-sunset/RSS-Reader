import React from "react";
import { ActivityIndicator, Button } from "react-native-paper";
import { colours } from "../assets/colours";

const CustomButton = ({ onPress, label, isLoading, colour }) => (
  <Button
    mode="contained"
    onPress={onPress}
    style={{
      backgroundColor: colour,
      paddingVertical: 5,
      borderRadius: 30,
      elevation: 4, // Add elevation for shadow
      shadowColor: colours.black, // Customize shadow color if needed
      shadowOffset: { width: 0, height: 2 }, // Customize shadow offset if needed
      shadowOpacity: 0.5, // Customize shadow opacity if needed
      shadowRadius: 4, // Customize shadow radius if needed
    }}
    labelStyle={{
      color: colours.black,
      fontSize: 18,
      fontFamily: "notoSerifBold",
    }}
    disabled={isLoading}
  >
    {isLoading ? <ActivityIndicator color={colours.black} /> : label}
  </Button>
);

export default CustomButton;
