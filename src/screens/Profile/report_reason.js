import {ContainerTop, SmallBtnText, SmallRedBtn, Title} from "../../styles/styles";
import {IconButton} from "react-native-paper";
import {Controller, useForm} from "react-hook-form";
import A2btextarea from "../../components/a2btextarea";
import {useTranslation} from "react-i18next";
import useApiService, {accEndpoints, getAccessToken, headers} from "../../services/api";
import {Keyboard} from "react-native";


export default function ReportReason({route}) {
    const { PostApi } = useApiService();
    const { itemId } = route.params;

    const {navigation} = route.params;

    console.log(itemId, 'id');
    const { t } = useTranslation();
    const { control, handleSubmit,formState ,formState: { errors }  } = useForm();




    async function onSubmit(data) {
        const formData = new FormData();
        formData.append('ReportedId', itemId);
        formData.append('Description', data.description);
        formData.append('Title', 'report');
        try {
            Keyboard.dismiss()
            const accessToken = await getAccessToken();
            const responseData = await PostApi(accEndpoints.post.Report, formData, {
                headers: {
                    ...headers.headers,
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            navigation.navigate('Action',{navigation:navigation, titleItem:'report_sent'})
        } catch (error) {
            console.error('Error submitting data:', error);
        } finally {
        }
    }


    return(
        <ContainerTop style={{paddingTopTop:100}}>
            <IconButton
                style={{position:'absolute', top:50, left:7, zIndex:3}}
                icon="arrow-left"
                iconColor='#7a7a7a'
                size={32}
                onPress={() => navigation.goBack()}
            />
            <Title style={{marginTop: 64, marginBottom: -25}}>{t('write_reason')}</Title>
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
                style={{ marginTop: 0 }}
            />
            <SmallRedBtn style={{position:'absolute', bottom:7}} buttonColor='#FF5A5F' mode='contained' onPress={handleSubmit(onSubmit)}>
                <SmallBtnText>{t('report')}</SmallBtnText>
            </SmallRedBtn>
        </ContainerTop>
    )
}
