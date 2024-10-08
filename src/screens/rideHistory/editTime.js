import React from 'react';
import {Button, IconButton} from "react-native-paper";
import {View} from "react-native";
import styled from "styled-components/native";
import {registerTranslation, TimePickerModal} from "react-native-paper-dates";
import {useTranslation} from "react-i18next";
import {ContainerTop, SmallBtnText, SmallRedBtn, Title} from "../../styles/styles";

registerTranslation('en', {
    save: 'Save',
    close: 'Close',
    minute: 'Minute',
    hour: 'Hour'
})
const EditTime = ({ route }) => {
    const { setValue, navigation, timeNow } = route.params;
    const { t } = useTranslation();
    const [time, setTime] = React.useState(timeNow || null);
    const [visibleTime, setVisibleTime] = React.useState(false)

    const onDismissTime = React.useCallback(() => {
        setVisibleTime(false)
    }, [setVisibleTime])


    const onConfirmTime = React.useCallback(
        ({ hours, minutes }) => {
            setVisibleTime(false);
            const formatedMinutes = minutes < 10 ? `0${minutes}` : minutes
            setTime(hours + ':'+ formatedMinutes)


        },
        [setVisibleTime]
    );

    const handlePress = () => {
        setValue(time, null);
        navigation.goBack()
    };

    return (
        <ContainerTop style={{paddingTop:180}}>
              <IconButton
                style={{ position: 'absolute', top: 55, left: 7, zIndex: 3 }}
                icon="arrow-left"
                iconColor='#7a7a7a'
                size={32}
                onPress={() => navigation.goBack()}
            />
           <Title>{t('at_what_time_will_you_pick_passengers_up')}</Title>
            <View style={{width:'100%', alignItems:'center'}}>
            <TimeBtn
                buttonColor='transparent'
                mode="outlined"
                textColor='black'
                onPress={()=> setVisibleTime(true)}
            >
                <TimeText>{time}</TimeText>
            </TimeBtn>
            <IconButton
                style={{position:'absolute',right:60,top:3, zIndex:-1}}
                icon="chevron-down"
                iconColor='#FF5A5F'
                size={30}
            />
        </View>

            <TimePickerModal
                use24HourClock={true}
                visible={visibleTime}
                onDismiss={onDismissTime}
                onConfirm={onConfirmTime}
                hours={12}
                minutes={14}
            />

            <SmallRedBtn style={{position:'absolute', bottom:40}} buttonColor='#FF5A5F' mode='contained'  onPress={handlePress}>
                <SmallBtnText>{t('save')}</SmallBtnText>
            </SmallRedBtn>
        </ContainerTop>
    );
};

export default EditTime;

const TimeBtn = styled(Button)`
    padding-top: 0px;
    height: 58px;
    border-radius: 35px;
    width: 70%;
`;
const TimeText = styled.Text`
    height: 30px;
    line-height: 50px;
    font-size: 33px;
    text-align: center;
    font-weight: 600;
`;
