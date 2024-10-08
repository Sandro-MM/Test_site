import React, {useState} from 'react';
import {IconButton} from "react-native-paper";
import {ContainerMid, ContainerTop, Title} from "../../styles/styles";
import {Text, View} from "react-native";
import A2BNextIcon from "../../components/next_icon";
import {useTranslation} from "react-i18next";
const PassengerCount = ({ navigation , setValue , control }) => {
    const { t } = useTranslation();
    let [count, setCount] = useState(1);
    const decrementCount = () => {
        if (count > 1) {
            setCount(count =>{
                return count - 1
            });
        }
    };
    const incrementCount = () => {
        if (count < 5) {
            setCount(count =>{
                return count + 1
            });
        }
    };
    const nav = () => {
            setValue('passengerCount',count)
            navigation.navigate("Price")
    };

    return (
        <ContainerTop style={{paddingTop:190}}>
            <IconButton
                style={{ position: 'absolute', top: 60, left: 0, zIndex: 3 }}
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
            <A2BNextIcon onPress={nav}/>
        </ContainerTop>
    );
};

export default PassengerCount;
