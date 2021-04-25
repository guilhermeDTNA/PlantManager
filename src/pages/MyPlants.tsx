import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Image, FlatList, ScrollView, Alert} from 'react-native';
import {formatDistance} from 'date-fns';
import {pt} from 'date-fns/locale'

import {Header} from '../components/Header';
import {PlantCardSecondary} from '../components/PlantCardSecondary';
import {Load} from '../components/Load';

import colors from '../styles/colors';
import fonts from '../styles/fonts';
import {PlantProps, loadPlant, removePlant} from '../libs/storage';

import waterdrop from '../assets/waterdrop.png';


export function MyPlants(){

	const [MyPlants, setMyPlants] = useState<PlantProps[]>([]);
	const [loading, setLoading] = useState(true);
	const [nextWater, setNextWater] = useState<string>();

	function handleRemove(plant: PlantProps){
		Alert.alert('Remover', `Deseja remover a ${plant.name}?`,[
		{
			text: 'Não',
			style: 'cancel'
		},
		{
			text: 'Sim',
			onPress: async () => {
				try{
					await removePlant(plant.id);

					setMyPlants((oldData) => 
						oldData.filter((item) => item.id !== plant.id)
					);
				} catch(error){
					Alert.alert('Não foi possível remover! 😢️');
				}
			}
		}
		])
	}

	useEffect(() => {
		async function loadStorageData(){
			const plantsStoraged = await loadPlant();

			const nextTime = formatDistance(
				new Date(plantsStoraged[0].dateTimeNotification).getTime(),
				new Date().getTime(),
				{locale: pt}
			);

			setNextWater(
				`Não esqueça de regar a ${plantsStoraged[0].name} daqui a ${nextTime}.`
			)

			setMyPlants(plantsStoraged);
			setLoading(false);
		}

		loadStorageData();
	}, [])

	if(loading){
		return <Load />
	}
	return(
		<ScrollView showsVerticalScrollIndicator={false}>
			<View style={styles.container}>
				<Header />

				
				<View style={styles.spotLight}>

					<Image source={waterdrop} style={styles.spotLightImage} />
				
					<Text style={styles.spotLightText}>
						{nextWater}
					</Text>

				</View>

				<View style={styles.plants}>
					<Text style={styles.plantsTitle}>
						Próximas regadas
					</Text>
					
					<FlatList 
						data={MyPlants}
						keyExtractor={(item) => String(item.id)}
						renderItem={({item}) => (
							<PlantCardSecondary handleRemove={() => {handleRemove(item)}} data={item} />
						)}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{flex: 1}}
					/>
					
				</View>

			</View>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container:{
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 30,
		paddingTop: 50,
		backgroundColor: colors.background
	},
	spotLight:{
		backgroundColor: colors.blue_light,
		paddingHorizontal: 20,
		borderRadius: 20,
		height: 110,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	spotLightImage:{
		width: 60,
		height: 60
	},
	spotLightText:{
		flex: 1,
		color: colors.blue,
		paddingHorizontal: 20
	},
	plants:{
		flex: 1,
		width: '100%'
	},
	plantsTitle:{
		fontSize: 24,
		fontFamily: fonts.heading,
		color: colors.heading,
		marginVertical: 20
	}
})