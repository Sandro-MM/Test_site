import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,

} from 'react-native';
import { CalendarList } from 'react-native-calendars';
import {Container, TitleMap} from "../styles/styles";
import { calculateDate28Day } from "../services/TodayAndThreeMonthRange";
import A2BNextIcon from "./next_icon";
import Loading from "./loading";
import {useTranslation} from "react-i18next";


function CalendarRange({ navigation, setValue }) {
    const [formattedDate, setFormattedDate] = useState('');
    const [maxDate, setMaxDate] = useState('');
    const [startDay, setStartDay] = useState('');
    const [endDay, setEndDay] = useState('');
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        calculateDate28Day(setFormattedDate, setMaxDate);
        setTimeout(() => {
            setLoading(false)
        }, 450);
    }, []);

    const handleDayPress = (day) => {
        if (!startDay) {
            setStartDay(day.dateString);
            setEndDay('');
        } else if (!endDay) {
            if (day.dateString > startDay) {
                setEndDay(day.dateString);
            } else {
                setEndDay(startDay);
                setStartDay(day.dateString);
            }
        } else {
            setStartDay(day.dateString);
            setEndDay('');
        }
    };

    const getMarked = () => {
        let marked = {};

        if (startDay && endDay) {
            for (let d = new Date(startDay); d <= new Date(endDay); d.setDate(d.getDate() + 1)) {
                const dateString = d.toISOString().split('T')[0];
                marked[dateString] = {
                    color: dateString === startDay ? '#FF5A5F' : dateString === endDay ? '#FF5A5F' : '#FEE4E2',
                    textColor: dateString === startDay ? 'white' : dateString === endDay ? 'white' : 'black',
                    startingDay: dateString === startDay,
                    endingDay: dateString === endDay,
                };
            }
        } else if (startDay) {
            marked[startDay] = {
                color: '#FF5A5F',
                textColor: 'white',
                startingDay: true,
                endingDay: true,
            };
        }

        return marked;
    };

    const handleSubmit = () => {
        setValue('startDay', startDay);
        setValue('endDay', endDay || null);
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.header,{paddingTop: 20}]}>
                <TitleMap>{t('choose_date')}</TitleMap>
            </View>
            {
                loading &&
                <Container style={{zIndex:10, position:'absolute', flex:1, width:'100%', height:'100%'}}>
                    <Loading/>
                </Container>
            }

            <CalendarList
                theme={{
                    calendarBackground: '#F2F3F4',
                    todayTextColor: '#FF5A5F',
                    dayTextColor: '#000',
                    monthTextColor: '#000',
                    selectedDayBackgroundColor: '#FF5A5F',
                    selectedDayTextColor: '#ffffff',
                    day: {
                        borderRadius: 0,
                    },
                }}
                style={styles.calendar}
                pastScrollRange={0}
                futureScrollRange={1}
                minDate={formattedDate}
                maxDate={maxDate}
                onDayPress={handleDayPress}
                markingType="period"
                markedDates={getMarked()}
            />

            <A2BNextIcon onPress={handleSubmit} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    header: {
        zIndex: 2,
        flex: 0.5,
        position: 'absolute',
        backgroundColor: '#F2F3F4',
        top: 0,
        left: 0,
        width: '100%',
        paddingLeft: 4,
        paddingTop: 0,
    },
    calendar: {
        paddingTop: 40,
    },
});

export default CalendarRange;
