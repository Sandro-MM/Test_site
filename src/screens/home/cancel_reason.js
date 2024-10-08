import {ContainerTop, SmallBtnText, SmallRedBtn, Title} from "../../styles/styles";
import {IconButton} from "react-native-paper";
import {Controller, useForm} from "react-hook-form";
import A2btextarea from "../../components/a2btextarea";
import {useTranslation} from "react-i18next";
import useApiService, {getAccessToken, OrderEndpoints} from "../../services/api";
import {Keyboard} from "react-native";


export default function CancelReason({route}) {
    const { PostApi } = useApiService();
    const { itemId } = route.params;

    const {navigation} = route.params;

    console.log(itemId, 'id');
    const { t } = useTranslation();
    const { control, handleSubmit,formState ,formState: { errors }  } = useForm();




    async function onSubmit(data) {
        try {
            Keyboard.dismiss()
            const accessToken = await getAccessToken();
            const responseData = await PostApi(OrderEndpoints.post.cancelRide+itemId, {Reason:data.description, OrderId: itemId}, {
                headers: {
                    Accept: '*/*',
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            navigation.navigate('Action', { navigation:navigation, titleItem:'ride_canceled'})
        } catch (error) {
            console.error('Error submitting data:', error);
        } finally {
        }
    }


    return(
        <ContainerTop style={{paddingTopTop:150}}>
            <IconButton
                style={{position:'absolute', top:55, left:5, zIndex:3}}
                icon="arrow-left"
                iconColor='#7a7a7a'
                size={32}
                onPress={() => navigation.goBack()}
            />
            <Title style = {{marginBottom: -25, marginTop: 65}}>{t('write_reason')}</Title>
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
            <SmallRedBtn style={{position:'absolute', bottom:7}} buttonColor='#FF5A5F' mode='contained' onPress={handleSubmit(onSubmit)}>
                <SmallBtnText>{t('cancel_ride')}</SmallBtnText>
            </SmallRedBtn>
        </ContainerTop>
    )
}
