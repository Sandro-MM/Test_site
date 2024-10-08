import React, {useEffect, useState} from 'react';
import {SmallBtnText, SmallRedBtn, Title} from "../../styles/styles";
import {Text, View} from "react-native";
import {Checkbox, IconButton} from "react-native-paper";
import {OrderIconColorMapping, OrderIconMapping} from "../../styles/vehicleMappings";
import useApiService, {accEndpoints, getAccessToken} from "../../services/api";
import {useTranslation} from "react-i18next";


const PrefrenceSettings = (props) => {
    const { PutApi } = useApiService();
    const { t } = useTranslation();
    const setTypes = props.route.params.defaultValue

    const checkIfIdExists = (id) => setTypes.some(type => type.Id === id);

    // Initializing state based on the presence of specific Ids
    const [pets, setPets] = useState(checkIfIdExists(3));
    const [music, setMusic] = useState(checkIfIdExists(2));
    const [luggage, setLuggage] = useState(checkIfIdExists(4));
    const [smoke, setSmoke] = useState(checkIfIdExists(1));
    const [packageItem, setPackageItem] = useState(checkIfIdExists(5));

    useEffect(() => {
        // Update state variables if setTypes changes
        setPets(checkIfIdExists(3));
        setMusic(checkIfIdExists(2));
        setLuggage(checkIfIdExists(4));
        setSmoke(checkIfIdExists(1));
        setPackageItem(checkIfIdExists(5));
    }, [setTypes]);


    const  changePrefrence = async () => {
        const Value =
            {
                UserDetailsModel:{
                    UserDetailsDescriptionIds:[
                        pets ? 3 : null,
                        music ? 2 : null,
                        luggage ? 4 : null,
                        smoke ? 1 : null,
                        packageItem ? 5 : null
                    ].filter(item => item !== null)
                }
            }


        try {
            const accessToken = await getAccessToken();
            const responseData = await PutApi(accEndpoints.put.EditProfile, Value, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            props.navigation.navigate('Profile',{ IsUserOrder: 1, navigation:  props.navigation })
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };


    return (
       <View style={{ width:'100%', height:'100%',  alignItems:'center'}}>
           <Title>{t('change_preferences')}</Title>
           <View style={{justifyContent:'flex-start', width:'50%'}} >
           <View  style={{flexDirection:'row', alignItems:'center'}}>
               <Checkbox

                   color={'#FF5A5F'}
                   status={smoke ? 'checked' : 'unchecked'}
                   onPress={() => {
                       setSmoke(!smoke);
                   }} />
               <IconButton
                   style={{marginTop:0, marginBottom:0, height:20, width:24}}
                   iconColor={OrderIconColorMapping[1]}
                   size={20}
                   icon={OrderIconMapping[1]}
               />
               <Text style={{fontSize:16, marginLeft:-5}}>  {t('smoker')}</Text>
           </View>
           <View  style={{flexDirection:'row', alignItems:'center'}}>
               <Checkbox

                   color={'#FF5A5F'}
                   status={music ? 'checked' : 'unchecked'}
                   onPress={() => {
                       setMusic(!music);
                   }} />
               <IconButton
                   style={{marginTop:0, marginBottom:0, height:20, width:24}}
                   iconColor={OrderIconColorMapping[7]}
                   size={20}
                   icon={OrderIconMapping[7]}
               />
               <Text style={{fontSize:16, marginLeft:-5}}>  {t('music')}</Text>
           </View>
           <View  style={{flexDirection:'row', alignItems:'center'}}>
               <Checkbox

                   color={'#FF5A5F'}
                   status={pets ? 'checked' : 'unchecked'}
                   onPress={() => {
                       setPets(!pets);
                   }} />
               <IconButton
                   style={{marginTop:0, marginBottom:0, height:20, width:24}}
                   iconColor={OrderIconColorMapping[4]}
                   size={20}
                   icon={OrderIconMapping[4]}
               />
               <Text style={{fontSize:16, marginLeft:-5}}>  {t('pets')}</Text>

           </View>
           <View  style={{flexDirection:'row', alignItems:'center'}}>
               <Checkbox

                   color={'#FF5A5F'}
                   status={luggage ? 'checked' : 'unchecked'}
                   onPress={() => {
                       setLuggage(!luggage);
                   }} />
               <IconButton
                   style={{marginTop:0, marginBottom:0, height:20, width:24}}
                   iconColor={OrderIconColorMapping[9]}
                   size={20}
                   icon={OrderIconMapping[9]}
               />
               <Text style={{fontSize:16, marginLeft:-5}}> {t('travel')}</Text>
           </View>
           <View  style={{flexDirection:'row', alignItems:'center', width:250}}>
               <Checkbox

                   color={'#FF5A5F'}
                   status={packageItem ? 'checked' : 'unchecked'}
                   onPress={() => {
                       setPackageItem(!packageItem);
                   }} />
               <IconButton
                   style={{marginTop:0, marginBottom:0, height:20, width:24}}
                   iconColor={OrderIconColorMapping[9]}
                   size={20}
                   icon={'chat-outline'}
               />
               <Text style={{fontSize:16, marginLeft:-5}}>{t('chatter')}</Text>
           </View>
               </View>
           <SmallRedBtn style={{position:'absolute', bottom:7, height:40, paddingTop:0}} buttonColor='#FF5A5F' mode='contained' onPress={()=>changePrefrence()}>
               <SmallBtnText>{t('save')}</SmallBtnText>
           </SmallRedBtn>
       </View>
    );
};
export default PrefrenceSettings

