import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function Header(){

	const [userName, setUserName] = useState<string>();
	const [imageUserProfile, setImageUserProfile] = useState<string>();

	useEffect(() => {
		async function loadStorageUserName(){
			const user = await AsyncStorage.getItem('@plantmanager:user');

			setUserName(user || '');
		}

		loadStorageUserName();
	}, [userName]);
	//Quando há o nome do estado nos colchetes, o useEffect será executado sempre que ele for alterado

	useEffect(() => {
		async function loadStorageUserProfile(){
			const imageProfile = await AsyncStorage.getItem('@plantmanager:imageProfile');

			setImageUserProfile(imageProfile || '');
		}

		loadStorageUserProfile();
	}, [imageUserProfile]);

	return(

		<View style={styles.container}>
			<View>
				<Text style={styles.greeting}>Olá, </Text>
				<Text style={styles.userName}>{userName}</Text>
			</View>

			<Image style={styles.image} source={{
				uri: imageUserProfile,
			}} />
		</View>

	)
}

const styles = StyleSheet.create({
	container:{
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 20,

		marginTop: getStatusBarHeight()
	},
	image:{
		width: 70,
		height: 70,
		borderRadius: 40
	},
	greeting:{
		fontSize: 32,
		color: colors.heading,
		fontFamily: fonts.heading
	},
	userName:{
		fontSize: 32,
		fontFamily: fonts.heading,
		color: colors.heading,
		lineHeight: 40
	}
})