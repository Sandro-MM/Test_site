import React from 'react';
import {BackIcon} from "../styles/styles";

const A2BBackIcon = ({ onPress }) => {
    return (
        <BackIcon
            icon="chevron-left-circle"
            iconColor='#FF5A5F'
            size={50}
            onPress={onPress}
        />
    );
};

export default A2BBackIcon;
