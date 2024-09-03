import { StyleSheet } from "react-native";
import { Colors } from "./Colors";
import dimensions from "./Dimensions";



export const btnVarients = StyleSheet.create({
  textBtn: {
    // fontSize: 16,
    fontSize: dimensions.vw * 4,
    color: Colors.primary,
    fontWeight: "500",
    fontFamily: "Montserrat SemiBold",

  },
  containedBtn: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 19,
    // fontSize: dimensions.vw * 3.8,
    fontFamily: "Montserrat Bold",
    padding: 3,


  },
  outlineBtn: {
    color: Colors.primary,
    fontWeight: "700",
    fontSize: 19,
    // fontSize: dimensions.vw * 3.8,
    fontFamily: "Montserrat Bold",
    padding: 3,
  },
})
export const textVariants = StyleSheet.create({
  default: {
    fontSize: 10,
    lineHeight: 14,
    color: Colors.gray
  },
  productsHeading: {
    // fontSize: 12,
    fontSize: dimensions.vw * 2.9,
    color: Colors.black,
    fontFamily: "Montserrat Medium",
    fontWeight: "500",
    textAlign: 'center'
  },
  textHeading2: {
    fontSize: 24,
    // fontSize: dimensions.vw * 5.6,
    color: Colors.primary,
    fontFamily: "Montserrat SemiBold",
    fontWeight: "600"
  },
  textMainHeading: {
    fontSize: 22,
    // fontSize: dimensions.vw * 4.9,
    color: Colors.black,
    fontFamily: "Montserrat SemiBold",
    fontWeight: "600"
  },
  textHeading: {
    fontSize: 20,
    // fontSize: dimensions.vw * 4.6,
    color: Colors.black,
    fontFamily: "Montserrat SemiBold",
    fontWeight: "600"
  },
  textSubHeading: {
    // fontSize: 18,
    fontSize: dimensions.vw * 4.3,
    color: Colors.gray,
    fontFamily: "Montserrat Medium",
    fontWeight: "500"
  },
  buttonTextHeading: {
    // fontSize: 14,
    fontSize: dimensions.vw * 3.3,
    color: Colors.white,
    fontFamily: "Montserrat SemiBold",
    fontWeight: "600"
  },
  buttonTextSubHeading: {
    // fontSize: 10.4,
    fontSize: dimensions.vw * 2.6,
    color: Colors.white,
    fontFamily: "Montserrat Medium",
    fontWeight: "500"
  },
  buttonText: {
    fontSize: 24,
    // fontSize: dimensions.vw * 5.6,
    color: Colors.white,
    fontFamily: "Montserrat Bold",
    fontWeight: "700"
  },
  headingSecondary: {
    // fontSize: 18,
    fontSize: dimensions.vw * 4.1,
    color: Colors.primary,
    fontFamily: "Montserrat Bold",
    fontWeight: "700"
  },
  bigheading: {
    fontSize: 32,
    color: Colors.black,
    fontFamily: "Montserrat ExtraBold",
    fontWeight: "800"
  }

})



