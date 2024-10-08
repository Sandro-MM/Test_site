import React from 'react';
import {Icon, IconButton} from "react-native-paper";
import {ContainerMid, VehicleName} from "../../styles/styles";
import {View} from "react-native";
import CheckboxForm from "../../components/checkboxForm";
import A2BNextIcon from "../../components/next_icon";
import Loading from "../../components/loading";
import {useTranslation} from "react-i18next";

const Description = ({setValue, navigation, onSubmit, isLoading}) => {
    const { t } = useTranslation();


    return (
        <ContainerMid>
            {
                isLoading ? <Loading/> :

                    <ContainerMid style={{paddingTop:'11%'}}>
                        <IconButton
                            style={{position:'absolute', top:99, left:-15, zIndex:3}}
                            icon="arrow-left"
                            iconColor='#7a7a7a'
                            size={32}
                            onPress={() => navigation.navigate("Description")}
                        />
                        <View style={{flexDirection:'row'}}>
                            <Icon
                                source="smoking"
                                color={'black'}
                                size={33}
                            />
                            <VehicleName>  {t('is_smoking_allowed')}</VehicleName>

                        </View>
                        <CheckboxForm options={['Yes','On Stops','No']} setValue={setValue} param={'Smoking'}/>
                        <View style={{flexDirection:'row', marginTop:30}}>
                            <Icon
                                source="paw"
                                color={'black'}
                                size={33}
                            />
                            <VehicleName>   {t('are_pets_allowed')}</VehicleName>

                        </View>
                        <CheckboxForm options={['Yes','Depends on pet','No']} setValue={setValue} param={'Pets'}/>
                        <View style={{flexDirection:'row' , marginTop:30}}>
                            <Icon
                                source="music"
                                color={'black'}
                                size={33}
                            />
                            <VehicleName>   {t('is_music_allowed')}</VehicleName>

                        </View>
                        <CheckboxForm options={['Yes','No']} setValue={setValue} param={'Music'}/>
                        <View style={{flexDirection:'row' , marginTop:30}}>
                            <Icon
                                source="bag-suitcase"
                                color={'black'}
                                size={33}
                            />
                            <VehicleName>   {t('is_luggage_allowed')}</VehicleName>

                        </View>
                        <CheckboxForm options={['Yes','No']} setValue={setValue} param={'Luggage'}/>
                        <View style={{flexDirection:'row' , marginTop:30}}>
                            <Icon
                                source="package-variant-closed"
                                color={'black'}
                                size={33}
                            />
                            <VehicleName>   {t('is_package_allowed')}</VehicleName>

                        </View>
                        <CheckboxForm options={['Yes','No']} setValue={setValue} param={'Package'}/>

                        <A2BNextIcon onPress={onSubmit}/>
                    </ContainerMid>
            }
        </ContainerMid>
    );
};

export default Description;
