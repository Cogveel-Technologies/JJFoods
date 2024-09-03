import { StyleSheet } from "react-native";
import { Colors } from "./Colors";
import { moderateVerticalScale, } from "react-native-size-matters";
import dimensions from "./Dimensions";


export const btnVarients = StyleSheet.create({
  textBtn: {
    fontSize: 16,
    // fontSize: dimensions.vw * 2.5,
    color: Colors.primary,
    fontWeight: "500",
    fontFamily: "Montserrat SemiBold",

  },
  containedBtn: {
    fontSize: 19,
    // fontSize: dimensions.vw * 3.8,
    color: Colors.white,
    fontWeight: "700",
    fontFamily: "Montserrat Bold",
    paddingTop: dimensions.vh * 1,
    paddingBottom: dimensions.vh * 0.2
  },
  outlineBtn: {
    fontSize: 19,
    // fontSize: dimensions.vw * 3.8,
    color: Colors.primary,
    fontWeight: "700",
    fontFamily: "Montserrat Bold",
    paddingTop: moderateVerticalScale(7),
    paddingBottom: dimensions.vh * 0.2
  },
})
export const textVariants = StyleSheet.create({
  default: {
    fontSize: 10,
    lineHeight: 14,
    color: Colors.gray
  },
  textHeading2: {
    // fontSize: 24,
    fontSize: dimensions.vw * 5.6,
    color: Colors.primary,
    fontFamily: "Montserrat SemiBold",
    fontWeight: "600"
  },
  textMainHeading: {
    // fontSize: 22,
    fontSize: dimensions.vw * 4.9,
    color: Colors.black,
    fontFamily: "Montserrat SemiBold",
    fontWeight: "600"
  },
  textHeading: {
    // fontSize: 20,
    fontSize: dimensions.vw * 4.6,
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
    // fontSize: 11,
    fontSize: dimensions.vw * 2.9,
    color: Colors.white,
    fontFamily: "Montserrat Medium",
    fontWeight: "500"
  },
  buttonText: {
    // fontSize: 24,
    fontSize: dimensions.vw * 5.6,
    color: Colors.white,
    fontFamily: "Montserrat Bold",
    fontWeight: "700"
  },
  headingSecondary: {
    // fontSize: 18,
    fontSize: dimensions.vw * 4.2,
    color: Colors.primary,
    fontFamily: "Montserrat Bold",
    fontWeight: "700"
  },
  bigheading: {
    fontSize: 32,
    color: Colors.black,
    fontFamily: "Montserrat ExtraBold",
    fontWeight: "800"
  },
  SecondaryHeading: {
    // fontSize: 16,
    fontSize: dimensions.vw * 3.9,
    color: Colors.black,
    fontFamily: "Montserrat Medium",
    fontWeight: "500"
  },

})



