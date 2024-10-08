import {IconButton} from "react-native-paper";
import React from "react";

export const BackButton =({navigation}) =>{
    return(
        <IconButton
            style={{position:'absolute', top:0, left:0, zIndex:3}}
            icon="arrow-left"
            iconColor='#7a7a7a'
            size={32}
            onPress={() => navigation.navigation.goBack()}
        />
        )

}
