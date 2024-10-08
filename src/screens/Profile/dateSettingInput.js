import React from 'react';
import {IconButton} from "react-native-paper";
import { ContainerTop, SmallBtnText, SmallRedBtn, Title} from "../../styles/styles";
import MaskInput from "react-native-mask-input/src/MaskInput";
import {Masks} from "react-native-mask-input";
import useApiService, {accEndpoints, getAccessToken} from "../../services/api";
import {useTranslation} from "react-i18next";



const DateSettingInput = (props) => {
    const { PutApi } = useApiService();
    const { t } = useTranslation();
    const [birthdate, setBirthdate] = React.useState('');
    const setBirthDate = props.route.params.setBirthDate;


    const  changeData = async () => {
        const parts = birthdate.split('/');
        const dateObj = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        const formattedDate = dateObj.toISOString();
        const Value =
            {
                BirthDate: formattedDate
            }
        try {
            const accessToken = await getAccessToken();
            const responseData = await PutApi(accEndpoints.put.EditProfile, Value, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setBirthDate(birthdate)
            props.navigation.goBack()

        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    return (
        <ContainerTop style={{paddingTop:100}}>
            <IconButton
                style={{position:'absolute', top:60, left:7, zIndex:3}}
                icon="arrow-left"
                iconColor='#7a7a7a'
                size={32}
                onPress={() => props.navigation.goBack()}
            />
            <Title>{t('change_birthdate')}</Title>
            <MaskInput
                autoFocus={true}
                style={{height:45, backgroundColor:'#D8D9DA', width:'85%', borderRadius:14, paddingVertical:5, paddingHorizontal:15, fontSize:18}}
                keyboardType = 'numeric'
                placeholder={'DD/MM/YYYY'}
                value={birthdate}
                mask={Masks.DATE_DDMMYYYY}
                onChangeText={(masked) => {
                    setBirthdate(masked);
                }}
            />
            <SmallRedBtn style={{position:'absolute', bottom:7}} disabled={birthdate.length<10} buttonColor='#FF5A5F' mode='contained' onPress={()=>changeData()}>
                <SmallBtnText>{t('save')}</SmallBtnText>
            </SmallRedBtn>
        </ContainerTop>
    );
};

export default DateSettingInput;
