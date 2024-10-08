import React from 'react';
import {Controller} from 'react-hook-form';
import {IconButton} from "react-native-paper";
import A2btextarea from "../../components/a2btextarea";
import {ContainerTop, SmallBtnText, SmallRedBtn, Title} from "../../styles/styles";
import useApiService, {accEndpoints, getAccessToken} from "../../services/api";
import {useTranslation} from "react-i18next";

const DescriptionSetting = (props) => {
    const { PutApi } = useApiService();
    const { t } = useTranslation();
    const title = props.route.params.title;
    const defaultValue = props.route.params.defaultValue;
    const control = props.route.params.control


    const  Save = async () => {
        const Value =
            {
                UserDetailsModel: {
                    Description: control._formValues.Description
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
            props.navigation.goBack()
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    return (
        <ContainerTop style={{paddingTopTop:100}}>
            <IconButton
                style={{position:'absolute', top:55, left:7, zIndex:3}}
                icon="arrow-left"
                iconColor='#7a7a7a'
                size={32}
                onPress={() => props.navigation.goBack()}
            />
            <Title style={{marginBottom:-30, marginTop:60}}>{t(title)}</Title>
            <Controller
                control={control}
                render={({ field }) => (
                    <A2btextarea
                        placeholder={`Enter description`}
                        value={field.value}
                        onChangeText={(value) => field.onChange(value)}
                        variant='default'
                    />
                )}
                name={'Description'}
                defaultValue={defaultValue}
            />
            <SmallRedBtn style={{position:'absolute', bottom:7}} buttonColor='#FF5A5F' mode='contained' onPress={Save}>
                <SmallBtnText>{t('save')}</SmallBtnText>
            </SmallRedBtn>
        </ContainerTop>
    );
};

export default DescriptionSetting;
