import LottieView from "lottie-react-native"; // Import LottieView
import { colours } from "../assets/colours";

const AnimationView = () => (
  <LottieView
    source={require("../assets/animations/loading-animation.json")}
    backgroundColor={colours.lightBlue}
    autoPlay
    loop
  />
);

export default AnimationView;
