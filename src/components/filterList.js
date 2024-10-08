import React, {Fragment, useEffect, useState} from 'react';
import {View, FlatList, TouchableHighlight} from 'react-native';
import {
    Container,
    FormInput,
    TitleAddVehicle,
    VehicleBntText
} from "../styles/styles";
import {Divider, IconButton} from "react-native-paper";
import { TextInput } from 'react-native-paper';
import {colorMapping, fuelTypeMapping, vehicleTypeMapping} from "../styles/vehicleMappings";
import {useTranslation} from "react-i18next";


const CarList = ({ data, title, placeholder, onSelectItem, IconMode, navigation , defaultValue}) => {
    const [search, setSearch] = useState(defaultValue);
    const [filteredData, setFilteredData] = useState(data);
    const { t } = useTranslation();

    const handleReset = () => {
        handleSearch('');
    };

    useEffect(() => {
        handleSearch(search);
    }, []);
    const handleSearch = (text) => {
        setSearch(text);
        const filtered = data.filter((item) =>
            item.Name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredData(filtered);
    };

    const viewStyle= { height: 65, flexDirection:'row'};
    const iconStyle = {marginRight:-20};
    const iconBtnPsos = { position: 'absolute', right: 0, top: 4 };
    const TxtinputPos = { position: 'absolute', bottom: -18, zIndex: 1 };

    const ColorIcon = ({ id }) => (
        <IconButton
            style={{ marginRight: -22 }}
            iconColor={colorMapping[id]}
            size={35}
            icon='circle'
        />
    );

    const TypeIcon = ({ id }) => (
        <IconButton
            style={iconStyle}
            color='#1B1B1B'
            size={30}
            icon={vehicleTypeMapping[id] || 'car-side'}
        />
    );

    const FuelIcon = ({ id }) => (
        <IconButton
            style={iconStyle}
            color='#1B1B1B'
            size={30}
            icon={fuelTypeMapping[id] || 'gas-station'}
        />
    );

    const renderCarItem = ({ item }) => (
        <Fragment>
        <TouchableHighlight
            underlayColor="rgba(128, 128, 128, 0.2)"
            onPress={() => onSelectItem(item.Id)}>

            <View
                style={viewStyle}
            >
                {IconMode === 'Color' && <ColorIcon id={item.Id} />}
                {IconMode === 'VehicleType' && <TypeIcon id={item.Id} />}
                {IconMode === 'FuelType' && <FuelIcon id={item.Id} />}

                <VehicleBntText>{item.Name}</VehicleBntText>

            </View>
        </TouchableHighlight>

            <Divider style={{ width: '90%' }} horizontalInset={true} bold={true} />

            <IconButton
                style={iconBtnPsos}
                color='#1B1B1B'
                size={30}
                icon="chevron-right"
            />
        </Fragment>
    );

    return (
        <Container>
            <TitleAddVehicle>{t(title)}</TitleAddVehicle>
            <FormInput

                underlineColor='transparent'
                activeUnderlineColor='transparent'
                activeOutlineColor="black"
                selectionColor='black'
                cursorColor='black'
                mode="flat"
                style={{ marginLeft: 'auto', marginRight: 'auto' }}
                placeholder={placeholder}
                right={
                    search.length > 0 ? (
                        <TextInput.Icon
                            name="close"
                            style={TxtinputPos}
                            onPress={handleReset}
                            icon='close'
                        />
                    ) : null
                }
                value={search}
                onChangeText={handleSearch}

            />
            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.Id.toString()}
                renderItem={renderCarItem}
                initialNumToRender={10}
                removeClippedSubviews={true}
            />
        </Container>
    );
};

export default CarList;
