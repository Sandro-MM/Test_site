import React, { useState } from 'react';
import { View, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import {useNavigation} from "@react-navigation/native";

const CarGallery = ({ route }) => {
    const { data = [] } = route.params; // Destructure and provide a default value
    const navigation = useNavigation()
    const [isVisible, setIsVisible] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleOpenImage = (index) => {
        setCurrentIndex(index);
        setIsVisible(true);
    };

    return (
        <View style={styles.container}>
            <ImageViewing
                images={data.map(item => ({ uri: item.Name }))}
                imageIndex={currentIndex}
                visible={isVisible}
                onRequestClose={() => navigation.goBack()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    image: {
        marginHorizontal: '5%',
        marginTop:20,
        width: '90%',
        height: 260,
    },
});

export default CarGallery;
