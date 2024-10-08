import * as React from 'react';
import {Fragment, useEffect, useState} from 'react';
import {Controller, useForm} from "react-hook-form";
import useApiService, {
    CarEndpoints,
    getAccessToken,

    headers,
    headersTextToken,

} from "../../services/api";
import {createStackNavigator} from '@react-navigation/stack';
import {
    ContainerMid,
    TitleLeft,
    Title
} from "../../styles/styles";
import A2bInput from "../../components/formInput";
import A2BNextIcon from "../../components/next_icon";
import CarList from "../../components/filterList";
import Loading from "../../components/loading";
import ImageUploadComponent from "./imageUpload";
import {Keyboard, View} from "react-native";
import {IconButton} from "react-native-paper";
import {useTranslation} from "react-i18next";
import * as SecureStore from "expo-secure-store";
import {ErrorContext} from "../../components/errorContext";
import {useContext} from "react";


const Stack = createStackNavigator();
export default function AddVehicle({ route, navigation,  }) {
    const { PutApi } = useApiService();
    const { GetApi } = useApiService();
    const { DelApi } = useApiService();
    const { PostApi } = useApiService();
    const { t } = useTranslation();

    const { mode } = route.params || {};

    const { item } = route.params || {};


    console.log('navigation',navigation, 'navigation')
    const { control,handleSubmit ,formState: { errors }  } = useForm();
    const [selectedManufacturer, setSelectedManufacturer] = useState('');
    const [modelsData, setModelData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState(
        item?.CarPictureUrls.slice(0, 5).map(picture => ({ id: picture.Id, url: picture.Name })) || []
    );
    const [removedImageIds, setRemovedImageIds] = useState([]);
    
    const { handleError } = useContext(ErrorContext);

    const [imagesId, setImagesId] = useState(
        item?.CarPictureUrls.slice(0, 5).map(picture => picture.Id) || []
    );
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedFuel, setSelectedFuel] = useState('');
    const [carData, setCarData] = useState({
        manufact: null,
        model: null,
        color: null,
        carType: null,
        carFul: null,
    });

    const filterData = (data, searchText) => {
        return data.filter((item) =>
            item.Name.toLowerCase().includes(searchText.toLowerCase())
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); // Set loading to true when data fetching starts
                const language = await SecureStore.getItemAsync('userLanguage');
                const accessToken = await getAccessToken();
                const commonHeaders = {
                    ...headersTextToken.headers,
                    'Accept-Language': language,
                    Authorization: `Bearer ${accessToken}`,
                };
                const [manufactData, colorData, carTypeData, carFuelData] = await Promise.all([
                    GetApi(CarEndpoints.get.Manufact, { headers: commonHeaders }),
                    GetApi(CarEndpoints.get.Color, { headers: commonHeaders }),
                    GetApi(CarEndpoints.get.Type, { headers: commonHeaders }),
                    GetApi(CarEndpoints.get.Fuel, { headers: commonHeaders }),
                ]);

                setCarData({
                    manufact: manufactData,
                    color: colorData,
                    carType: carTypeData,
                    carFul: carFuelData,
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    async function onSubmit(data) {
        console.log(images, 'imagesimagesimages');
        console.log(mode);
        try {
            Keyboard.dismiss();
            setLoading(true);
            console.log('Submitting data...');

            const accessToken = await getAccessToken();

            if (mode === 'addVehicle') {
                console.log('Adding vehicle...');

                const ProfileFile = images[0];
                const newImages = images.slice(1);
                const formData = new FormData();
                formData.append('ManufacturerId', selectedManufacturer);
                formData.append('ModelId', selectedModel);
                formData.append('ColorId', selectedColor);
                formData.append('CarTypeId', selectedType);
                formData.append('PlateNumber', data.PlateNumber);
                formData.append('FuelTypeId', selectedFuel);
                formData.append('ReleaseDate', data.Year);
                formData.append('ProfileFile', { uri: ProfileFile.url, type: 'image/jpeg', name: 'image.jpg' });
                newImages.forEach((image, index) => {
                    formData.append('Files', { uri: image.url, type: 'image/jpeg', name: `image_${index}.jpg` });
                });

                const responseData = await PostApi(CarEndpoints.post.Car, formData, {
                    headers: {
                        ...headers.headers,
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'multipart/form-data',
                        'Accept-Language': 'ka-GE',
                        'accept': '*/*',
                    },
                });

                if (responseData.AccessToken){
                    try {
                        await SecureStore.setItemAsync('accessToken', responseData.AccessToken);
                    } catch (error) {
                        console.error('Error saving tokens:', error);
                    }
                }


                navigation.navigate('Action', { navigation: navigation, titleItem: 'vehicle_added' });
            } else if (mode === 'editVehicle') {
                console.log('Editing vehicle...');
                const dataItem = {
                    Id: item.Id,
                    CarTypeId: selectedType,
                    ColorId: selectedColor,
                    Description: null,
                    FuelTypeId: selectedFuel,
                    ManufacturerId: selectedManufacturer,
                    ModelId: selectedModel,
                    PlateNumber: data?.PlateNumber,
                    ReleaseDate: data?.Year
                }

                const filesFormData = new FormData();
                filesFormData.append('CarId', item.Id);
                images.forEach((image, index) => {
                    filesFormData.append('Files', { uri: image.url, type: 'image/jpeg', name: `image_${index}.jpg` });
                });

                console.log(filesFormData, 'filesFormDatafilesFormData');

                const responseData = await PutApi(`${CarEndpoints.put.Car}/${item.Id}`, dataItem, {
                    headers: {

                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (removedImageIds.length > 0) {
                    console.log('Removing images...');
                    const uniqueIdsString = removedImageIds.map(id => `uniqueIds=${id}`).join('&');
                    if (uniqueIdsString) {
                        filesFormData.append('RemovedIds', uniqueIdsString);
                    }
                    const delFileData = await DelApi(`${CarEndpoints.delete.Picture}`, {
                        headers: {
                            ...headers.headers,
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }, `${item.Id}/delete-car-files?${uniqueIdsString}`);
                }

                if (images.length > 0) {
                    console.log('Adding images...');
                    const addFileData = await PostApi(`${CarEndpoints.post.AddPicture}`, filesFormData, {
                        headers: {
                            ...headers.headers,
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'multipart/form-data',
                            'Accept-Language': 'ka-GE',
                            'accept': '*/*',
                        },
                    });
                }

                navigation.navigate('Action', { navigation: navigation, titleItem: 'vehicle_edited' });
            }
        } catch (error) {
            console.error('Error submitting data:', error);
        } finally {
            setLoading(false);
            navigation.navigate('Profile', { IsUserOrder: 1, navigation: navigation });
        }
    }

    const getModel = async (id) => {
        console.log(id, 'setSelectedManufacturer');
        const endpoint = CarEndpoints.get.Model + id;
        console.log(endpoint, 'endpoint');

        try {
            setLoading(true); // Set loading to true when data fetching starts

            const accessToken = await getAccessToken();
            const commonHeaders = {
                ...headersTextToken.headers,
                Authorization: `Bearer ${accessToken}`,
            };

            const modelData = await GetApi(endpoint, { headers: commonHeaders });
            setModelData(modelData);
            navigation.navigate('Model')
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <Stack.Navigator>
            <Stack.Screen name="Plate" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <>
                        {loading && <Loading />}
                        {!loading && (
                            <ContainerMid>
                                <IconButton
                                    rippleColor="rgba(128, 128, 128, 0.2)"
                                    style={{ position: 'absolute', top: 45, left: 0, zIndex: 3 }}
                                    icon='close'
                                    iconColor='#7a7a7a'
                                    size={28}
                                    onPress={() => navigation.goBack()}
                                />

                                <Title style={{position:'absolute', top:80,}}>{t('whats_your_licence_plate_number')}</Title>
                                <Controller
                                    control={control}
                                    render={({ field }) => (
                                        <React.Fragment>
                                            <A2bInput
                                                style={{position:'absolute', top:240}}
                                                autoFocus={true}
                                                placeholder="XX123XX"
                                                value={field.value}
                                                onChangeText={(value) => field.onChange(value)}
                                                variant ='default'
                                            />
                                            {field.value.length > 0 && (
                                                <A2BNextIcon onPress={() => navigation.navigate('Make')} />
                                            )}
                                        </React.Fragment>
                                    )}
                                    name="PlateNumber"
                                    defaultValue={item?.PlateNumber || ''}
                                />

                            </ContainerMid>
                        )}
                    </>
                )}
            </Stack.Screen>
            <Stack.Screen name="Make" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <>
                        {loading && <Loading />}
                        {!loading && (
                            <View style={{flex:1}}>
                                <IconButton
                                    style={{position:'absolute', left:0 , top: 0, zIndex:10}}
                                    icon="arrow-left"
                                    iconColor='#7a7a7a'
                                    size={32}
                                    onPress={() => navigation.navigate('Plate')}
                                />
                                <CarList
                                    defaultValue={item?.Manufacturer.Name || ''}
                                    navigation={navigation}
                                    data={carData.manufact}
                                    filterFunction={filterData}
                                    title={'whats_your_vehicles_brand'}
                                    placeholder={'Make'}
                                    variant={'default'}
                                    onSelectItem={(selectedItem) => {
                                        console.log(selectedItem, 'selectedItem');
                                        setSelectedManufacturer(selectedItem);
                                        getModel(selectedItem);
                                    }}
                                />
                            </View>
                        )}
                    </>
                )}
            </Stack.Screen>
            <Stack.Screen name="Model" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <View style={{flex:1}}>
                        <IconButton
                            style={{position:'absolute', left:0 , top: 0, zIndex:10}}
                            icon="arrow-left"
                            iconColor='#7a7a7a'
                            size={32}
                            onPress={() => navigation.navigate('Make')}
                        />
                        {
                            modelsData &&
                            <CarList
                                defaultValue={item?.Model.Name || ''}
                                navigation={navigation}
                                data={modelsData}
                                filterFunction={filterData}
                                title={'whats_your_vehicles_model'}
                                placeholder={'Model'} variant={'default'}
                                onSelectItem={(selectedItem) => {setSelectedModel(selectedItem); navigation.navigate("Type");}}
                            />
                        }

                    </View>
                )}
            </Stack.Screen>
            <Stack.Screen name="Type" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <View style={{flex:1}}>
                        <IconButton
                            style={{position:'absolute', left:0 , top: 0, zIndex:10}}
                            icon="arrow-left"
                            iconColor='#7a7a7a'
                            size={32}
                            onPress={() => navigation.navigate('Model')}
                        />
                        <CarList navigation={navigation}   defaultValue={item?.CarType?.Name || ''} IconMode='VehicleType' data={carData.carType} filterFunction={filterData} title={"what_kind_of_vehicle_it_is"} placeholder={'Type'} variant={'default'} onSelectItem={(selectedItem) => {setSelectedType(selectedItem); navigation.navigate("Color");}}
                        />
                    </View>
                )}
            </Stack.Screen>
            <Stack.Screen name="Color" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <View style={{flex:1}}>
                        <IconButton
                            style={{position:'absolute', left:0 , top: 0, zIndex:10}}
                            icon="arrow-left"
                            iconColor='#7a7a7a'
                            size={32}
                            onPress={() => navigation.navigate('Type')}
                        />
                        <CarList defaultValue={item?.Color?.Name || ''} navigation={navigation} IconMode='Color' data={carData.color} filterFunction={filterData} title={"what_color_is_your_vehicle"} placeholder={'Color'} variant={'default'} onSelectItem={(selectedItem) => {setSelectedColor(selectedItem); navigation.navigate("Fuel");}}
                        />
                    </View>
                )}
            </Stack.Screen>
            <Stack.Screen name="Fuel" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <View style={{flex:1}}>
                        <IconButton
                            style={{position:'absolute', left:0 , top: 0, zIndex:10}}
                            icon="arrow-left"
                            iconColor='#7a7a7a'
                            size={32}
                            onPress={() => navigation.navigate('Color')}
                        />
                        <CarList navigation={navigation} defaultValue={item?.FuelType?.Name || ''}  IconMode='FuelType' data={carData.carFul} filterFunction={filterData} title={"what_fuel_does_your_vehicle_use"} placeholder={'Fuel'} variant={'default'} onSelectItem={(selectedItem) => {setSelectedFuel(selectedItem); navigation.navigate("Image");}}
                        />
                    </View>
                )}
            </Stack.Screen>
            <Stack.Screen name="Image" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <Fragment>
                        <IconButton
                            style={{position:'absolute', left:0 , top: 0, zIndex:10}}
                            icon="arrow-left"
                            iconColor='#7a7a7a'
                            size={32}
                            onPress={() => navigation.navigate('Fuel')}
                        />
                        <ImageUploadComponent  setImages={setImages}
                                               images={images}
                                               removedImageIds={removedImageIds}
                                               setRemovedImageIds={setRemovedImageIds} />
                        {images.length > 0 && (
                            <A2BNextIcon  onPress={() => navigation.navigate('Year')} />
                        )}
                    </Fragment>

                )}
            </Stack.Screen>
            {/* <Stack.Screen name="Year" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <>
                        {loading && <Loading />}
                        {!loading && (
                            <ContainerMid>
                                <IconButton
                                    style={{position:'absolute', left:0 , top: 36, zIndex:10}}
                                    icon="arrow-left"
                                    iconColor='#7a7a7a'
                                    size={32}
                                    onPress={() => navigation.navigate('Image')}
                                />
                                <TitleLeft style={{position:'absolute', top:120,}}>{t('when_was_your_vehicle_registered')}</TitleLeft>
                                <Controller
                                    control={control}
                                    render={({ field }) => (
                                        <React.Fragment>
                                            <A2bInput
                                                autoFocus={true}
                                                style={{position:'absolute', top:220,}}
                                                placeholder="2013"
                                                value={field.value}
                                                onChangeText={(value) => field.onChange(value)}
                                                variant ='default'
                                            />
                                            {field.value.length > 0 && (
                                                <A2BNextIcon onPress={handleSubmit(onSubmit)} />
                                            )}
                                        </React.Fragment>
                                    )}
                                    name="Year"
                                    defaultValue={item?.ReleaseDate.toString() || ''}
                                />
                            </ContainerMid>
                        )}
                    </>
                )}
            </Stack.Screen> */}

<Stack.Screen name="Year" options={{ headerShown: false }}>
    {({ navigation }) => (
        <>
            {loading && <Loading />}
            {!loading && (
                <ContainerMid>
                    <IconButton
                        style={{position:'absolute', left:5 , top: 55, zIndex:10}}
                        icon="arrow-left"
                        iconColor='#7a7a7a'
                        size={32}
                        onPress={() => navigation.navigate('Image')}
                    />
                    <TitleLeft style={{position:'absolute', left: '7.2%', top:130,}}>{t('when_was_your_vehicle_registered')}</TitleLeft>
                    <Controller
                        control={control}
                        rules={{
                            required: 'Release date is required',
                            pattern: {
                                value: /^[0-9]{4}$/,  
                                message: 'Please enter a valid year',
                            },
                            validate: (value) => {
                                const year = parseInt(value, 10);
                                const currentYear = new Date().getFullYear();
                                if (year < 1960 || year > currentYear) {
                                    return handleError({
                                        type: 'error',
                                        data: {
                                            response: {
                                                data: {
                                                    detail: t('properly_releaseDate'),
                                                }
                                            }
                                        }
                                    });
                                }
                                return true;
                            }
                        }}
                        render={({ field }) => (
                            <React.Fragment>
                                <A2bInput
                                    autoFocus={true}
                                    style={{position:'absolute', top:220,}}
                                    placeholder="2013"
                                    value={field.value}
                                    onChangeText={(value) => {
                                        if (/^[0-9]{0,4}$/.test(value)) {
                                            field.onChange(value);
                                        }
                                    }}
                                    variant ='default'
                                    keyboardType="numeric" 
                                />
                                {field.value.length > 0 && (                                   
                                    // <A2BNextIcon onPress={handleSubmit(onSubmit)} />
                                    <A2BNextIcon onPress={handleSubmit((data) => {
                                        const year = parseInt(data.Year, 10);
                                        const currentYear = new Date().getFullYear();
                                        if (year >= 1960 && year <= currentYear) {
                                            onSubmit(data); 
                                        } else {
                                            handleError({
                                                type: 'error',
                                                data: {
                                                    response: {
                                                        data: {
                                                            detail: t('properly_releaseDate'),
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                    })} />
                                )}
                            </React.Fragment>
                        )}
                        name="Year"
                        defaultValue={item?.ReleaseDate?.toString() || ''}
                    />
                </ContainerMid>
            )}
        </>
    )}
</Stack.Screen>

        </Stack.Navigator>
    );
}

