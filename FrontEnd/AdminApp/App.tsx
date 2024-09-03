import * as React from 'react';

import { adaptNavigationTheme } from 'react-native-paper';
import { DefaultTheme } from '@react-navigation/native';
import Navigation from './src/navigation/Index';
import { StatusBar, View } from 'react-native';
import Toast from 'react-native-toast-message';


const { LightTheme } = adaptNavigationTheme({ reactNavigationLight: DefaultTheme });

export default function App() {
  return (
    <>
      <Navigation />
      <Toast />
    </>
  );
}
