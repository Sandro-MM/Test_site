import {ContainerTop, SmallBtnText, SmallRedBtn, Title} from "../../styles/styles";
import {IconButton} from "react-native-paper";
import {Controller, useForm} from "react-hook-form";
import A2btextarea from "../../components/a2btextarea";
import {useTranslation} from "react-i18next";
import useApiService, {getAccessToken, OrderEndpoints} from "../../services/api";
import {Keyboard} from "react-native";
import React, { useState } from "react";


export default function CancelReasonOwner({route}) {
    const { itemId } = route.params;

    const {navigation} = route.params;

    const { PostApi } = useApiService();
    const { t } = useTranslation();
    const { control, handleSubmit,formState ,formState: { errors }  } = useForm();


    const [isButtonDisabled, setIsButtonDisabled] = useState(false); 


    async function onSubmit(data) {
        if (isButtonDisabled) return; 

        console.log('asdasdasdasdasdasdasdasdasd');

        try {
            setIsButtonDisabled(true); 
            Keyboard.dismiss()
            const accessToken = await getAccessToken();
            const responseData = await PostApi(OrderEndpoints.post.cancelOrderOwnerReason, {Reason:data.description, OrderId: itemId}, {
                headers: {
                    Accept: '*/*',
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            navigation.navigate('Action', { navigation:navigation, titleItem:'ride_canceled'})
        } catch (error) {
            console.error('Error submitting data:', error);
        } finally {
            setTimeout(() => {
                setIsButtonDisabled(false); 
            }, 3000);
        }
    }


    return(
        <ContainerTop style={{paddingTopTop:150}}>
            <IconButton
                style={{position:'absolute', top:51, left:5, zIndex:3}}
                icon="arrow-left"
                iconColor='#7a7a7a'
                size={32}
                onPress={() => navigation.goBack()}
            />
            <Title style={{marginBottom: -25, marginTop: 65}}>{t('write_reason')}</Title>
            <Controller
                control={control}
                render={({ field }) => (
                    <A2btextarea
                        placeholder={t('enter_reason')}
                        value={field.value}
                        onChangeText={(value) => field.onChange(value)}
                        variant='default'
                    />
                )}
                name={'description'}
                defaultValue={''}
            />
            <SmallRedBtn style={{position:'absolute', bottom:7}} buttonColor='#FF5A5F' mode='contained' onPress={handleSubmit(onSubmit)}
                            disabled={isButtonDisabled} 
>
                <SmallBtnText>{t('cancel_ride')}</SmallBtnText>
            </SmallRedBtn>
        </ContainerTop>
    )
}
