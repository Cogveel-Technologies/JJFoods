import * as React from 'react';
import { AppRegistry, useColorScheme } from 'react-native';
import { MD3LightTheme, MD3DarkTheme, PaperProvider, useTheme, } from 'react-native-paper';
import { name as appName } from './app.json';
import App from './App';
import { lightTheme } from './src/theme/LightTheme';
import { darkTheme } from './src/theme/DarkTheme';
import { Colors } from './src/theme/Colors';

import { store, persistor } from './src/store/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import Toast from 'react-native-toast-message';


const LightTheme = {
  ...MD3LightTheme,
  colors: lightTheme.colors,

}

const DarkTheme = {
  ...MD3DarkTheme,
  colors: darkTheme.colors
}

export default function Main() {

  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? DarkTheme : LightTheme;
  const updatedTheme = {
    ...theme,
    fonts: {
      ...theme.fonts,
      bodyLarge: {
        ...theme.fonts.bodyLarge,
        fontFamily: 'Montserrat Medium',
      },
    },
    colors: {
      ...theme.colors,
      primary: Colors.primary,
      secondary: Colors.secondary,
      tertiary: Colors.ternary,
    },
  };


  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={updatedTheme}>
          <App />
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
