import {ContainerTop, SmallBtnText, SmallRedBtn, Title} from "../../styles/styles";
import {IconButton} from "react-native-paper";
import {Controller, useForm} from "react-hook-form";
import A2btextarea from "../../components/a2btextarea";
import {useTranslation} from "react-i18next";
import useApiService, {accEndpoints, getAccessToken} from "../../services/api";
import {Keyboard, View} from "react-native";
import {useState} from "react";


export default function WriteReview({route}) {
    const { PostApi } = useApiService();
    const { itemId } = route.params;
    const { orderId } = route.params;
    const {navigation} = route.params;
    const [rating, setRating] = useState(0);


    console.log(itemId, 'id');
    const { t } = useTranslation();
    const { control, handleSubmit,formState ,formState: { errors }  } = useForm();




    async function onSubmit(data) {
        const formData = {
            StarCount: rating,
            UserBadgeTypeIds: [
                0
            ],
            Review: data.description,
            CreatedFor: itemId,
            OrderId: orderId
        }

        try {
            Keyboard.dismiss()
            const accessToken = await getAccessToken();
            const responseData = await PostApi(accEndpoints.post.Review, formData, {
                headers: {

                    Authorization: `Bearer ${accessToken}`,
                },
            });
            navigation.navigate('Action', { navigation:navigation, titleItem:'review_sent'})
        } catch (error) {
            console.error('Error submitting data:', error);
        } finally {
        }
    }


    const handlePress = (value) => {
        setRating(value);
        console.log(value)
    };

    return(
        <ContainerTop style={{paddingTopTop:100}}>
            <IconButton
                style={{position:'absolute', top:45, left:0, zIndex:3}}
                icon="arrow-left"
                iconColor='#7a7a7a'
                size={32}
                onPress={() => navigation.goBack()}
            />
            <Title style={{marginBottom:-40}}>{t('write_review')}</Title>
            <Controller
                control={control}
                render={({ field }) => (
                    <A2btextarea
                        placeholder={''}
                        value={field.value}
                        onChangeText={(value) => field.onChange(value)}
                        variant='default'
                    />
                )}
                name={'description'}
                defaultValue={''}
            />
            <View style={{ flexDirection: 'row',
                justifyContent: 'center', marginTop:-10}}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <IconButton
                        key={star}
                        icon="star"
                        iconColor={star <= rating ? '#FDB022' : '#667085'}
                        size={30}
                        onPress={() => handlePress(star)}
                    />
                ))}
            </View>
            <SmallRedBtn style={{position:'absolute', bottom:20}} buttonColor='#FF5A5F' mode='contained' onPress={handleSubmit(onSubmit)}>
                <SmallBtnText>{t('send')}</SmallBtnText>
            </SmallRedBtn>
        </ContainerTop>
    )
}



