import React, {useEffect, useState} from 'react';
import {Divider, IconButton} from "react-native-paper";
import {Container,Title} from "../../styles/styles";
import {BackHandler, Text, TouchableHighlight, View} from "react-native";
import {useTranslation} from "react-i18next";



const AddBackRide = ({ navigation, handleYesPress , handleNoPress}) => {
    const { t } = useTranslation();
    const viewStyle = { height: 65,  width:'100%', textAlign:'left'};
    const [red, setRed] = useState(false);
    useEffect(() => {
        const backAction = () => {
                navigation.navigate('HomeScreen');
                return true;
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => backHandler.remove();
    }, [navigation]);

    const handleNoPressBtn = () => {
        handleNoPress()
        setRed(false)
    };
    const handleYesPressBtn = () => {
        handleYesPress()
        setRed(true)
    };
    return (
        <Container>
            <IconButton
                style={{position:'absolute', top:29, left:5, zIndex:3}}
                icon="arrow-left"
                iconColor='#7a7a7a'
                size={32}
                onPress={() => navigation.navigate('HomeScreen')}
            />
            <Title style={{marginTop:-180}}>{t('coming_back_as_well_publish_your_return_ride_now')}</Title>
            <TouchableHighlight
                style={{marginVertical:2 }}
                underlayColor="rgba(128, 128, 128, 0.2)"
                onPress={handleYesPressBtn}
            >
                <View
                    style={viewStyle}
                >
                    <Text style={{ marginLeft:20,marginTop: 15, fontSize: 18,  color:red?'#FF5A5F':'black'}}>{t('yes_sure')}</Text>
                    <IconButton
                        style={{position:'absolute', top:0, right:0, zIndex:3}}
                        icon="chevron-right"
                        iconColor='#7a7a7a'
                        size={32}

                    />
                </View>
            </TouchableHighlight>
            <Divider style={{ width: '90%', marginTop: 0 }} horizontalInset={true} bold={true} />
            <TouchableHighlight
                style={{marginVertical:2 }}
                underlayColor="rgba(128, 128, 128, 0.2)"
                onPress={handleNoPressBtn}
            >
                <View
                    style={viewStyle}
                >
                    <Text style={{ marginLeft:20,marginTop: 15, fontSize: 20, color:red?'black':'#FF5A5F'}}>{t('no_thanks')}</Text>
                    <IconButton
                        style={{position:'absolute', top:0, right:0, zIndex:3}}
                        icon="chevron-right"
                        iconColor='#7a7a7a'
                        size={32}
                    />
                </View>

            </TouchableHighlight>
        </Container>
    );
};

export default AddBackRide;
