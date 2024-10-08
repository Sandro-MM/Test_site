
import {ContainerMid, HomeBg, ProfilePic, Title} from "../../styles/styles";
import * as React from "react";
import Navigation from "../../components/navigation";
import SearchElement from "./searchElement";
import {CardStyleInterpolators, createStackNavigator} from "@react-navigation/stack";
import CalendarRange from "../../components/calendarRange";
import {useForm} from "react-hook-form";
import PlacesSearch from "./placesSearch";
import {OrdersList} from "./ordersList";
import {ListFilter} from "../../components/listFilter";
import {useTranslation} from "react-i18next";
import BG from '../../../assets/img/home-search/bg.png'
import {AppState, ImageBackground} from "react-native";
import {format} from "date-fns";
import {useEffect, useState} from "react";
import {connectSignalR, getAccessToken} from "../../services/api";
import * as signalR from "@microsoft/signalr";
import {Button} from "react-native-paper";



export default function HomeScreen({navigation}) {

    const {Connect} = connectSignalR()

    useEffect(() => {
        Connect()
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'dd.MM.yy');
    };
    const { t } = useTranslation();
    const Stack = createStackNavigator();
    const { control, handleSubmit, watch,setValue,getValues} = useForm();
    const startDay = control._formValues.startDay;
    const endDay = control._formValues.endDay;



    const startDateFormatted = startDay ? formatDate(startDay) : "calendar";
    const endDateFormatted = endDay ? ` – ${formatDate(endDay)}` : "";


    const [leaving, setLeaving] = useState(control._formValues.departure);
    const [going, setGoing] = useState(control._formValues.destination);

    useEffect(() => {
        setLeaving(control._formValues.departure);
        setGoing(control._formValues.destination);
    }, [control._formValues.departure, control._formValues.destination]);

    const swapValues = () => {
        const { departure, destination, departureLatitude, destinationLatitude, departureLongitude, destinationLongitude } = getValues();
        setValue('departureLatitude', destinationLatitude);
        setValue('destinationLatitude', departureLatitude);
        setValue('departureLongitude', destinationLongitude);
        setValue('destinationLongitude', departureLongitude);
        setValue('departure', destination);
        setValue('destination', departure);

        // Force re-render by updating state
        setLeaving(destination);
        setGoing(departure);
    };

    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <ContainerMid style={{paddingTop:100}}>
                        <HomeBg
                            style={{marginTop:9, paddingHorizontal:10}}
                            source={BG}
                        />
                        <SearchElement
                            swapValues={swapValues}
                            setValue={setValue}
                            control={control}
                            navigation={navigation}
                            date={t(`${startDateFormatted}${endDateFormatted}`)}
                            leaving={leaving}
                            going={going}
                        />
                        <Navigation navigation={navigation} activeButton={'HomeScreen'}/>
                    </ContainerMid>
                )}
            </Stack.Screen>
            <Stack.Screen name="Calendar"  options={{
                gestureEnabled: true,
                cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,  headerShown: false
            }} >
                {({ navigation }) => (
                    <CalendarRange navigation={navigation} setValue={setValue} control={control}/>
                )}
            </Stack.Screen>
            <Stack.Screen name="Places" options={{ headerShown: false }}>
                {({ navigation, route }) => (
                    <PlacesSearch navigation={navigation} setValue={setValue}  type={route.params?.type} handleNavigation={()=>navigation.goBack()}/>
                )}
            </Stack.Screen>
            <Stack.Screen name="List" options={{ headerShown: false }}>
                {({ navigation}) => (
                    <OrdersList swapValues={swapValues} navigation={navigation} data={control} setValue={setValue}/>
                )}
            </Stack.Screen>
            <Stack.Screen name="ListFilterScreen" options={{ headerShown: false }}>
                {({ navigation}) => (
                    <ListFilter navigation={navigation} control={control} setValue={setValue}/>
                )}
            </Stack.Screen>
        </Stack.Navigator>
    );
}
