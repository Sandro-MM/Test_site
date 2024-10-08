import React from 'react';
import { Text, View } from "react-native";
import {RadioButton} from "react-native-paper";

const CheckboxForm = ({ options, setValue, param }) => {
    const [checked, setChecked] = React.useState(options[2] || options[1]);
    const setVal = (option) =>{
        setChecked(option)
        setValue(param, option)
    }

    return (
        <View style={{flexDirection:'row', paddingTop:8, paddingBottom:12}}>
            {options.map((option, index) => (

                <View key={index} style={{flexDirection:'row' , paddingHorizontal:5}}>
                    <RadioButton
                        value={option}
                        status={checked === option ? 'checked' : 'unchecked'}
                        onPress={() => setVal(option)}
                    />
                    <Text style={{ fontSize: 18, marginTop: 6 }}> {option}</Text>
                </View>
            ))}
        </View>
    );
};

export default CheckboxForm;
