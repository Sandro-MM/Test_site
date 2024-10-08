import React from 'react';
import { View } from 'react-native';
import {IconButton} from 'react-native-paper';
import {Subtitle} from "../styles/styles";
import SearchElement from "../screens/home/searchElement";
import {useTranslation} from "react-i18next";

export const ListFilterModal = ({navigation, date ,leaving, going , control, setValue,state, close, swapValues}) => {
    const { t } = useTranslation();
    return (
        <View style={{position:'absolute', top:0, left:0,zIndex:100, width:'100%', backgroundColor:'rgba(89,89,89,0.58)', justifyContent:'flex-start', alignItems:'center', height:'130%' }}>
            <View style={{backgroundColor:'#fff', width:'100%', height:'50%', justifyContent:'center', alignItems:'center'}}>
                <IconButton
                    style={{position:'absolute',top:30, left: 16}}
                    icon='close'
                    onPress={close}
                />
                <Subtitle>
                    {t('edit_your_search')}
                </Subtitle>
                <SearchElement
                    close={close}
                    setValue={setValue}
                    control={control}
                    navigation={navigation}
                    date={date}
                    leaving={leaving}
                    going={going}
                    swapValues={swapValues}
                />
            </View>

        </View>
    );
};




