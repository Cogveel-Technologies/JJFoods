import { DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { adaptNavigationTheme } from "react-native-paper";
import { StatusBar } from "react-native";
import AppNavigator from "./AppNavigator";
import AuthTabNavigator from "./AuthTabNavigator";
import { useAppSelector } from "../store/hooks";
import ReservedAdminNavigator from "./ReservedAdminNavigator";

const { LightTheme } = adaptNavigationTheme({ reactNavigationLight: DefaultTheme });

const Navigation = () => {
  const { isAuthenticated, role, token } = useAppSelector((store) => store.persistedReducer.authSlice)
  // console.log(isAuthenticated, "-----------------------")
  // console.log(role, '----------role---------')
  // const role1 = 'superAdmin'

  const renderNavigator = () => {
    if (isAuthenticated) {
      if (role === 'superAdmin') {
        return <AppNavigator />;
      } else if (role === 'reservedAdminA' || 'reservedAdminB') {
        return <ReservedAdminNavigator />;
      }
    } else {
      return <AuthTabNavigator />;
    }
  };


  return (
    <NavigationContainer theme={LightTheme}>
      <StatusBar backgroundColor={'#fdebcf'} barStyle="dark-content" />
      {renderNavigator()}
    </NavigationContainer>
  );
}

export default Navigation