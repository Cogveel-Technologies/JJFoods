import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { adaptNavigationTheme } from "react-native-paper";
import AppNavigator from "./AppNavigator";
import { StatusBar } from "react-native";
import AuthTabNavigator from "./AuthTabNavigator";
import { useAppSelector } from "../store/hooks";
const { LightTheme } = adaptNavigationTheme({ reactNavigationLight: DefaultTheme });
const Navigation = () => {
  const { isAuthenticated, isGuest, token } = useAppSelector((store) => store.persistedReducer.authSlice);

  // console.log(isAuthenticated, '----------authentication')
  // console.log(isGuest, '----------Guest')
  // console.log(token, '----------token')
  return (
    <NavigationContainer theme={LightTheme}>
      <StatusBar backgroundColor={'#fdebcf'} barStyle="dark-content" />
      {isAuthenticated ? <AppNavigator /> : <AuthTabNavigator />}
    </NavigationContainer>
  );
}

export default Navigation;
