import React, {useState} from 'react';
import {TextInput} from "react-native-paper";
import { FormInput } from "../styles/styles";


const A2bInput = ({ placeholder, variant, ...props }) => {
    const [secureTextEntry, setSecureTextEntry] = useState(variant === 'eye');

    const toggleSecureTextEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    const renderIcon = () => {
        const isEmpty = !props.value || props.value === '';

        if (variant === 'default' && !isEmpty) {
            return (
                <TextInput.Icon
                    icon="close"
                    onPress={() => {
                        if (props.onChangeText) {
                            props.onChangeText('');
                        }
                    }}
                />
            );
        } else if (variant === 'eye' && !isEmpty) {
            return (
                <TextInput.Icon
                    icon={secureTextEntry ? 'eye' : 'eye-off'}
                    onPress={toggleSecureTextEntry}
                />
            );
        } else {
            return null;
        }
    };

    return (
        <FormInput
            mode="flat"
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            right={renderIcon()}
            underlineColor='transparent'
            activeUnderlineColor='transparent'
            activeOutlineColor="black"
            selectionColor='black'
            cursorColor='black'
            {...props}
        />
    );
};

A2bInput.defaultProps = {
    underlineColorAndroid: 'transparent',
    activeUnderlineColor: 'transparent',
    activeOutlineColor: 'black',
    cursorColor: 'black',
    mode: 'flat',
    value: '',
    onChangeText: () => {},
    variant: 'none',
};

export default A2bInput;
