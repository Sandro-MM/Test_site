import React, { useRef } from 'react';
import { PanResponder, Animated } from 'react-native';
import { IconButton } from 'react-native-paper';

const MapMagnifyAnimation = ({focusInput}) => {
    const pan = useRef(new Animated.ValueXY()).current;
    const pan2 = useRef(new Animated.ValueXY()).current;
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gestureState) => {
                // Limit the movement of pan2 to only 10 pixels
                if (gestureState.dx <= 10 && gestureState.dx >= 0) {
                    pan.setValue({ x: gestureState.dx, y: gestureState.dy });
                    pan2.setValue({ x: gestureState.dx, y: gestureState.dy });
                }
            },
            onPanResponderRelease: (e, gestureState) => {
                if (gestureState.dx < -10) {
                    // If dragged to the left by at least 10 units
                    Animated.spring(pan, {
                        toValue: { x: -90, y: 0 }, // Move icon button to the left
                        useNativeDriver: false,
                    }).start();
                    Animated.spring(pan2, {
                        toValue: { x: -10, y: 0 }, // Move icon button to the left
                        useNativeDriver: false,
                    }).start();
                } else {
                    Animated.spring(pan2, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: false,
                    }).start();
                    // Return icon button to original position
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: false,
                    }).start();
                }
            },
        })
    ).current;

    const handlePress = () => {
        Animated.spring(pan2, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
        }).start();
        Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
        }).start();

        focusInput();
    };


    return (

            <Animated.View
                style={[
                    {
                        alignItems:'flex-end',
                        width: 80,
                        height: 160,
                        position: 'absolute',
                        top: '40%',
                        right: -10,
                        borderTopLeftRadius: 12,
                        borderBottomLeftRadius: 12,
                    },
                ]}
                {...panResponder.panHandlers}
            >
                <Animated.View style={[
                    {
                        width: 20,
                        height: 160,
                        backgroundColor: 'rgba(255,255,255,0.63)',
                        borderTopLeftRadius: 12,
                        borderBottomLeftRadius: 12,
                        borderStyle: 'solid',
                        borderWidth: 1,
                        borderColor: 'rgba(124,124,124,0.46)',

                    },
                    { transform: [{ translateX: Animated.add(Animated.subtract(pan2.x, 0), Animated.multiply(pan2.x.interpolate({ inputRange: [0, 10], outputRange: [0, 0] }), -1)) }, { translateY: pan2.y }] }, // Adjusting the translation to restrict movement

                ]}>
                 </Animated.View>
                <IconButton
                    style={[
                        {
                            position: 'absolute',
                            top: '30%',
                            right: -60,
                            backgroundColor: 'rgba(255,255,255,0.46)',
                            borderStyle: 'solid',
                            borderWidth: 1,
                            borderColor: 'rgba(124,124,124,0.46)',
                        },
                        { transform: [{ translateX: pan.x }, { translateY: pan.y }] },
                    ]}
                    icon="magnify"
                    iconColor={'rgba(128,128,128,0.79)'}
                    size={45}
                    onPress={handlePress}
                />
            </Animated.View>


    );
};

export default MapMagnifyAnimation;
