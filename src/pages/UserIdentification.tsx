import React, {useState, useEffect} from 'react';
import {
	SafeAreaView, 
	StyleSheet, 
	View, 
	Text, 
	TextInput, 
	KeyboardAvoidingView, 
	Platform, 
	TouchableWithoutFeedback, 
	Keyboard,
	Image,
	Alert,
	TouchableOpacity
} from 'react-native';
import {Entypo} from '@expo/vector-icons';
import {useNavigation, useRoute} from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

import {Button} from '../components/Button';

interface Params{
	buttonTitle: string;
}

export function UserIdentification(){
	const [isFocused, setIsFocused] = useState(false);
	const [isFilled, setIsFilled] = useState(false);
	const [name, setName] = useState<string>();

	const [image, setImage] = useState("https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png");

	useEffect(() => {
		async function storeProfileDefault(){

			await AsyncStorage.setItem('@plantmanager:imageProfile', image);
		}

		storeProfileDefault();
	});

	const pickImage = async () => {

		if (Platform.OS !== 'web') {
			const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
			if (status !== 'granted') {
				alert('Desculpe, mas precisamos de sua permissão para acessar a galeria');
			}
		}

		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.cancelled) {
			await setImage(result.uri);

			try{
				//Chave e valor a serem armazenados
				if(result.uri!==''){
					await AsyncStorage.setItem('@plantmanager:imageProfile', result.uri);	
				}


			} catch{
				Alert.alert('Não foi possível salvar a sua foto 😢️');
			}
		}

		
	};

	const navigation = useNavigation();
	const routes = useRoute();

	const{
		buttonTitle
	} = routes.params as Params;


	function handleInputBlur(){
		setIsFocused(false);
		setIsFilled(!!name);
	}

	function handleInputFocus(){
		setIsFocused(true);
	}

	function handleInputChange(value: string){
		setIsFilled(!!value);
		setName(value);
	}

	async function handleSubmit(){
		if(!name){
			return Alert.alert('Me diz como chamar você 😢️');
		}

		try{
			//Chave e valor a serem armazenados
			await AsyncStorage.setItem('@plantmanager:user', name);

			navigation.navigate('Confirmation', {
				title: 'Prontinho',
				subTitle: 'Agora vamos começar a cuidar das suas plantinhas com muito cuidado.',
				buttonTitle: 'Começar',
				icon: 'smile',
				nextScreen: 'PlantSelect'
			});
		} catch{
			Alert.alert('Não foi possível salvar o seu nome 😢️');
		}
	}

	//{isFilled ? <Entypo name="emoji-happy" size={24} color="green" style={styles.emoji} /> : <Entypo name="emoji-flirt" size={24} color="green" style={styles.emoji} />}


	return(
		<SafeAreaView style={styles.container}>
		<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
		<View style={styles.content}>
		<View style={styles.form} >
		<View style={styles.header}>

		<TouchableOpacity onPress={pickImage}>
		<Image style={styles.image} source={{
			uri: image,
		}} />
		</TouchableOpacity>


		<Text style={styles.title}>
		Como podemos {'\n'} 
		chamar você?
		</Text>

		<TextInput 
		style={[
			styles.input,
			(isFocused || isFilled) && {borderColor: colors.green}
			]} 
			placeholder="Digite um nome" 
			onBlur={handleInputBlur} 
			onFocus={handleInputFocus}
			onChangeText={handleInputChange}

			/>
			<View style={styles.footer}>
			<Button title={buttonTitle} onPress={handleSubmit} />
			</View>
			</View>
			</View>
			</View>
			</TouchableWithoutFeedback>
			</KeyboardAvoidingView>
			</SafeAreaView>	
			)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'space-around'
	},
	content: {
		flex: 1,
		width: '100%'
	},
	header:{
		alignItems: 'center'
	},
	form:{
		flex: 1,
		justifyContent: 'center',
		paddingHorizontal: 54,
		alignItems: 'center',
	},
	emoji:{
		fontSize: 44
	},
	input:{
		borderBottomWidth: 1,
		borderColor: colors.gray,
		color: colors.heading,
		width: '100%',
		fontSize: 18,
		marginTop: 50,
		padding: 10,
		textAlign: 'center'
	},
	title:{
		fontSize: 24,
		lineHeight: 32,
		textAlign: 'center',
		color: colors.heading,
		fontFamily: fonts.heading,
		marginTop: 20
	},
	footer:{
		marginTop: 40,
		width: '100%',
		paddingHorizontal: 20
	},
	image:{
		width: 100,
		height: 100,
		borderRadius: 40
	},
})