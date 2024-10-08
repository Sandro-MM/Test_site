import React, {useState} from 'react';
import {IconButton} from "react-native-paper";
import {ContainerMid, ContainerTop, SmallBtnText, SmallRedBtn, Title} from "../../styles/styles";
import {Text, View} from "react-native";
import A2BNextIcon from "../../components/next_icon";
import {useTranslation} from "react-i18next";
const EditPassengerCount = ({ navigation, route }) => {
    const { t } = useTranslation();
    const { setValue, submit } = route.params;
    const [count, setCount] = useState(1);

    const decrementCount = () => {
        if (count > 1) {
            setCount(count - 1);
        }
    };

    const incrementCount = () => {
        if (count < 5) {
            setCount(count + 1);
        }
    };

    const nav = () => {
        submit({ MaxPassenger: count });
        navigation.goBack();
    };

    return (
        <ContainerTop style={{paddingTop:150}}>
            <IconButton
                style={{ position: 'absolute', top: 55, left: 7, zIndex: 3 }}
                icon="arrow-left"
                iconColor='#7a7a7a'
                size={32}
                onPress={() => navigation.goBack()}
            />
            <Title>{t('how_many_passengers_are_you_willing_to_take')}</Title>
            <View style={{flexDirection:'row', width:'100%', justifyContent:'space-around'}}>
            <IconButton
                icon="minus-circle-outline"
                iconColor='#FF5A5F'
                size={80}
                onPress={decrementCount}
            />
                <Text style={{fontSize:60, marginTop:10}}>{count}</Text>
            <IconButton
                icon="plus-circle-outline"
                iconColor='#FF5A5F'
                size={80}
                onPress={incrementCount}
            />
            </View>
            <SmallRedBtn style={{position:'absolute', bottom:40}} buttonColor='#FF5A5F' mode='contained' onPress={nav}>
                <SmallBtnText>{t('save')}</SmallBtnText>
            </SmallRedBtn>

        </ContainerTop>
    );
};

export default EditPassengerCount;
