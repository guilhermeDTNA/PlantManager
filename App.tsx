import React from 'react';
import AppLoading from 'expo-app-loading';
import {useFonts, Jost_400Regular, Jost_600SemiBold} from '@expo-google-fonts/jost';

import Routes from './src/routes';

export default function App(){

  //Enquanto as fontes não forem carregadas, chama o AppLoading para deixar na tela de carregamento splash
  const [fontsLoaded] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold
  });

  if(!fontsLoaded){
    return(
      <AppLoading />
    )
  }

  return (

    <Routes />

    );
}