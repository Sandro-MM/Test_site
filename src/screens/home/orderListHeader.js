import React, {useState} from 'react';
import {Animated, StyleSheet, Text, TouchableHighlight, View} from "react-native";
import {Button, IconButton} from "react-native-paper";
import {useTranslation} from "react-i18next";
import FILTERBTN from "../../../assets/img/Button.png"
import BACK from "../../../assets/img/CaretLeft.png"
import ARROWS from "../../../assets/img/ArrowsLeftRight.png"
import CAR from "../../../assets/img/Car.png"
import VAN from "../../../assets/img/Van.png"
import {NotoSans_400Regular, NotoSans_600SemiBold, NotoSans_700Bold, useFonts} from "@expo-google-fonts/noto-sans";

export const OrderListHeader = ({ setModalVisible, navigation, departure, destination, OrdersTotalCount ,scrollY, startDay, endDay}) => {
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState(false);
    let [fontsLoaded] = useFonts({
        NotoSans_400Regular, NotoSans_600SemiBold ,NotoSans_700Bold
    });


    const categoryContainerTranslateY = scrollY.interpolate({
        inputRange: [0, 90],
        outputRange: [54, 4.2],
        extrapolate: 'clamp',
    });

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    const formatDate = (dateString) => {
        if (dateString){
            const dateObject = new Date(dateString);
            const month = dateObject.toLocaleString('default', { month: 'short' });
            const date = dateObject.getDate();
            return `${month} ${date}`;
        }
       else return null
    };

  if (fontsLoaded)  return (
        <View style={{ width: '100%', height: categoryContainerTranslateY+10, backgroundColor: 'white', zIndex: 12, paddingTop:expanded?18:12}}>
            <View style={{ backgroundColor: 'white', display: expanded ? 'none' : 'block' }}>
                <TouchableHighlight
                    style={{ marginHorizontal: 10, marginTop: 3, marginBottom: 12, borderRadius: 16, height: 64 }}
                    onPress={() => setModalVisible(true)}
                    underlayColor="rgba(128, 128, 128, 0.2)"
                >
                    <View style={{ borderRadius: 24, borderStyle: 'solid', borderColor: '#EAECF0', borderWidth: 1, paddingTop: 3, paddingLeft: 40, height: 56, background: '#FCFCFD'}}>
                        <IconButton
                            style={{ position: 'absolute', top: -2, left: -10, zIndex: 3 }}
                            icon={BACK}
                            iconColor='#7a7a7a'
                            size={32}
                            onPress={() => navigation.goBack()}
                        />
                        <View style={{flexDirection:'row'}}>
                            <Text style={{  fontSize: 16, marginTop: 2, fontFamily:'NotoSans_700Bold' }}>
                                {departure}
                            </Text>
                            <IconButton icon={ARROWS} size={20} style={{marginTop:0, marginHorizontal:-3}}/>
                            <Text style={{ fontSize: 16, marginTop: 2 , fontFamily:'NotoSans_700Bold' }}>
                                {destination}
                            </Text>
                        </View>
                        <Text style={{color: '#475467', fontSize:14, marginTop:-18, fontFamily:'NotoSans_400Regular'}}>{formatDate(startDay)} {endDay?'-':''} {formatDate(endDay)}</Text>

                        <IconButton style={{ position: 'absolute', right: -8, top: -8 }} onPress={() => navigation.navigate('ListFilterScreen')} icon={FILTERBTN} size={44} iconColor={null}>

                        </IconButton>
                    </View>
                </TouchableHighlight>
            </View>
            <Animated.View style={[styles.categoryContainer, { height:categoryContainerTranslateY ,display: expanded ? 'none' : 'block' }]}>
                <View style={{ width: '50%', alignItems: 'center' }}>
                    <Text style={[styles.categoryTitle,{fontFamily:'NotoSans_600SemiBold' }]}>{t('car_pool')}</Text>
                    <View style={{ flexDirection: 'row', marginLeft:'-12%'}}>
                        <IconButton icon={CAR} size={25} iconColor={'#667085'} style={styles.categoryIcon} />
                        <Text style={styles.categoryText}>
                            {OrdersTotalCount}
                        </Text>
                    </View>

                </View>
                <View style={{ width: '50%', alignItems: 'center' }}>
                    <Text  style={[styles.categoryTitle,{fontFamily:'NotoSans_600SemiBold' }]}>{t('intercity')}</Text>
                    <View style={{ flexDirection: 'row', marginLeft:'-12%'}}>
                        <IconButton icon={VAN} size={25} iconColor={'#667085'} style={styles.categoryIcon} />
                        <Text style={styles.categoryText}>
                            -
                        </Text>
                    </View>
                </View>
            </Animated.View>
            <View style={{ width: '40%', height: 3, backgroundColor: '#FF5A5F', alignSelf: 'center', zIndex: 99, marginBottom: 0, paddingBottom:0 }}>
                <IconButton icon={expanded?'menu-down':'menu-up'} size={25} iconColor={'#FF5A5F'} style={{ position: 'absolute', top:expanded? -22:-29, alignSelf: 'center' }} onPressOut={toggleExpand} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    categoryText:{
        marginTop:3,
        marginLeft:-35,
        fontWeight:'600',
        color:'#667085'
    },
    categoryIcon: {
        marginTop:-19,
        width:80,
        height:50,
        paddingTop:10,
        borderRadius:0,
        paddingRight:10
    },
    categoryTitle:{
        fontWeight:'600',
        color:'#667085'
    },
    categoryContainer: {
        width:'100%',
        backgroundColor:'#fff',
        marginTop:-10,
        flexDirection:'row',
        overflow:'hidden'
    }
})
