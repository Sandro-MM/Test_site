import {View} from 'react-native';
import * as React from "react";
import MapViewScreen from "../../components/mapView";
import {createStackNavigator} from "@react-navigation/stack";
import MapAToBViewScreen from "../../components/mapAToBView";
import A2BNextIcon from "../../components/next_icon";
import RidePrice from "./ridePrice";
import Description from "./description";
import {useForm} from "react-hook-form";
import CalendarListScreen from "../../components/calendarList";
import TimePicker from "../../components/timePicker";
import PassengerCount from "./passengerCount";
import Options from "./options";
import useApiService, {getAccessToken, headersTextToken, OrderEndpoints} from "../../services/api";
import AddBackRide from "./addBackRide";
import {useState} from "react";
import {
    DestionationLocaliRu,
    DestionationLocality,
    DestionationLocalityKa,
    fromLocality,
    fromLocalityKa,
    fromLocalityRu
} from "./locatity-functions";

export default function AddRide({navigation, route}) {

    const { PostApi } = useApiService();
    const {activeRidesNumber}= route.params;
    const {car}= route.params;
    const fromTitle = 'where_are_you_leaving_from'
    const toTitle = 'what_is_your_destination'
    const Stack = createStackNavigator();
    const { control, handleSubmit, watch,setValue} = useForm();
    const cf = control._formValues;
    const [reverseObj,setReverseObj]= useState(false)
    const [noBackNav,setNoBackNav]= useState(false)
    const [loadingItem,setLoading]= useState(false)
    async function createRide(data) {

        const selectedDate = control._formValues.selectedDate;
        const time = control._formValues.time;
        const [year, month, day] = selectedDate.split('-').map(Number);
        const [hours, minutes] = time.split(':').map(Number);
        const pickUpTime = new Date(year, month - 1, day, hours, minutes);
        const pickUpTimeISOString = pickUpTime.toISOString();



        const leavingFromLocalityShortName = await fromLocality(cf);
        const leavingFromLocalityShortNameKa = await fromLocalityKa(cf);
        const leavingFromLocalityShortNameRu = await fromLocalityRu(cf);

        const destinationLocalityShortName = await DestionationLocality(cf);
        const destinationLocalityShortNameKa = await DestionationLocalityKa(cf);
        const destinationLocalityShortNameRu = await DestionationLocaliRu(cf);


        const Smoking = cf.Smoking === "No" ? 1 : cf.Smoking === "Yes" ? 2 : cf.Smoking === "On Stops" ? 3 : 1;
        const Pets = cf.Pets === "No" ? 5 : cf.Pets === "Yes" ? 4 : cf.Pets === "Depends on pet" ? 6 : 5;
        const Music = cf.Music === "No" ? 8 : cf.Music === "Yes"?7 : 8;
        const Luggage = cf.Luggage === "No" ? 9 : cf.Luggage === "Yes"?10 : 9;
        const Package = cf.Package === "No" ? 12 : cf.Package === "Yes"?11 : 12;



        const  reqObject =[
            {
                PickUpTime: pickUpTimeISOString,
                MiddleSeat: false,
                Price: cf.RidePrice,
                MaxPassenger:  cf.passengerCount,
                CarId: car,
                Description: cf.description,
                InstantBooking: false,
                RouteDetails: {
                    Origin: {
                        Name: {
                            En: cf.LeavingFrom.formatted_address,
                            Ka: cf.LeavingFromKa.formatted_address,
                            Ru: cf.LeavingFromRu.formatted_address,
                        },
                        Latitude: cf.MapFrom.latitude,
                        Longitude: cf.MapFrom.longitude,
                        CityParent: {
                            En: leavingFromLocalityShortName,
                            Ka: leavingFromLocalityShortNameKa,
                            Ru: leavingFromLocalityShortNameRu
                        }
                    },
                    Destination: {
                        Name: {
                            En:cf.Destination.formatted_address,
                            Ka: cf.DestinationKa.formatted_address,
                            Ru: cf.DestinationRu.formatted_address,
                        },
                        Latitude: cf.MapTo.latitude,
                        Longitude: cf.MapTo.longitude,
                        CityParent: {
                            En: destinationLocalityShortName,
                            Ka: destinationLocalityShortNameKa,
                            Ru: destinationLocalityShortNameRu
                        }
                    },
                    Distance: cf.distance,
                    Duration: cf.duration
                },
                OrderDescriptionIds: [
                    Smoking,Pets,Music,Luggage,Package
                ]
            }]

        const  reversReqObject =[
            {
                PickUpTime: pickUpTimeISOString,
                MiddleSeat: false,
                Price: cf.RidePrice,
                MaxPassenger:  cf.passengerCount,
                CarId: car,
                Description: cf.description,
                InstantBooking: false,
                RouteDetails: {
                    Origin: {
                        Name: {
                            En:cf.Destination.formatted_address,
                            Ka: cf.DestinationKa.formatted_address,
                            Ru: cf.DestinationRu.formatted_address,
                        },
                        Latitude: cf.MapTo.latitude,
                        Longitude: cf.MapTo.longitude,
                        CityParent: {
                            En: destinationLocalityShortName,
                            Ka: destinationLocalityShortNameKa,
                            Ru: destinationLocalityShortNameRu
                        }
                    },
                    Destination: {
                        Name: {
                            En: cf.LeavingFrom.formatted_address,
                            Ka: cf.LeavingFromKa.formatted_address,
                            Ru: cf.LeavingFromRu.formatted_address,
                        },
                        Latitude: cf.MapFrom.latitude,
                        Longitude: cf.MapFrom.longitude,
                        CityParent: {
                            En: leavingFromLocalityShortName,
                            Ka: leavingFromLocalityShortNameKa,
                            Ru: leavingFromLocalityShortNameRu
                        }
                    },
                    Distance: cf.distance,
                    Duration: cf.duration
                },
                OrderDescriptionIds: [
                    Smoking,Pets,Music,Luggage,Package
                ]
            }]

        console.log(reqObject,'reqObject')


        try {
            setLoading(true)
            if (reverseObj === false){
                const accessToken = await getAccessToken();
                const responseData = await PostApi(OrderEndpoints.post.createOrder, reqObject, {
                    headers: {
                        ...headersTextToken.headers,
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setReverseObj(true)
                if (activeRidesNumber === 2){
                    navigation.navigate("RideAddedSucsess");
                    setTimeout(()=>( setLoading(false)),2000)

                } else {
                    navigation.navigate("AreYouGoingBack");
                   setTimeout(()=>( setLoading(false)),2000)
                }

            }
            else {

                const accessToken = await getAccessToken();
                const responseData = await PostApi(OrderEndpoints.post.createOrder, reversReqObject, {
                    headers: {
                        ...headersTextToken.headers,
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                navigation.navigate("RideAddedSucsess");
            }


        } catch (error) {
            console.error('Error submitting data:', error);
        } finally {

        }
    }


    return (
        <Stack.Navigator>
            <Stack.Screen name="LeavingFrom" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <MapViewScreen
                        title={fromTitle}
                        setValue={setValue}
                        valueName={'LeavingFrom'}
                        handleMapChoose={(handleMapChoose) => {
                            setValue('MapFrom', handleMapChoose);
                            console.log(control._formValues);
                            navigation.navigate("Destination")
                        }}
                    />
                )}
            </Stack.Screen>
            <Stack.Screen name="Destination" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <MapViewScreen
                        title={toTitle}
                        setValue={setValue}
                        valueName={'Destination'}
                        handleMapChoose={(handleMapChoose) => {
                            setValue('MapTo', handleMapChoose);
                            console.log(control._formValues);
                            navigation.navigate("AToBRoute")
                        }}
                    />
                )}
            </Stack.Screen>
            <Stack.Screen name="AToBRoute" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <View style={{width:'100%', flex:1}}>
                        <MapAToBViewScreen
                            startAddress={cf.LeavingFrom.formatted_address}
                            endAddress={cf.Destination.formatted_address}
                            title={'route'}
                            startPoint={control._formValues.MapFrom}
                            endPoint={control._formValues.MapTo}
                            setValue={setValue}
                            control={control}
                            navigation={navigation}
                        />




                    </View>

                )}
            </Stack.Screen>
            <Stack.Screen name="Calendar" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <View style={{width:'100%', flex:1}}>
                        <CalendarListScreen control={control} noBackNav={noBackNav} setValue={setValue} navigation={navigation} />
                    </View>
                )}
            </Stack.Screen>
            <Stack.Screen name="ChooseTime" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <View style={{width:'100%', flex:1}}>
                        <TimePicker setValue={setValue}  navigation={() => navigation.navigate("PassengerCount")} Backnavigation={()=>navigation.navigate("Calendar")}/>
                    </View>
                )}
            </Stack.Screen>
            <Stack.Screen name="PassengerCount" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <View style={{width:'100%', flex:1}}>
                        <PassengerCount  navigation={navigation} control={control} setValue={setValue}/>

                    </View>
                )}
            </Stack.Screen>
            <Stack.Screen name="Price" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <View style={{width:'100%', flex:1}}>
                        <RidePrice distance={control._formValues.distance}  navigation={navigation} control={control} setValue={setValue}/>
                        <A2BNextIcon onPress={() =>  navigation.navigate("Description")}/>
                    </View>
                )}
            </Stack.Screen>
            <Stack.Screen name="Description" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <Description control={control} navigation={navigation} name={'description'} handleSubmit={(value) => {
                        console.log(control._formValues);
                        navigation.navigate("Options");
                    }}/>
                )}
            </Stack.Screen>
            <Stack.Screen name="Options" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <Options setValue={setValue} navigation={navigation} onSubmit={()=>createRide(control)} isLoading={loadingItem}/>
                )}
            </Stack.Screen>
            <Stack.Screen name="AreYouGoingBack" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <AddBackRide navigation={navigation} handleYesPress={() => {navigation.navigate("Calendar"); setNoBackNav(true)}} handleNoPress={()=>navigation.navigate("RideAddedSucsess")}/>
                )}
            </Stack.Screen>
        </Stack.Navigator>
    );
}
