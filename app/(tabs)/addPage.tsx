import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Platform,
} from 'react-native';
import CollapsibleHeaderPage from '@/components/CollapsibleHeaderPage'; // Adjust path as needed
import { router } from 'expo-router'; // Keep if needed elsewhere

import { useTravelContext } from '@/context/PageContext';
import Button from '@/components/BaseButton';

interface ButtonConfig {
    id: string
    text: string; // The button label
}

const navigationButtons: ButtonConfig[] = [
    {
        id: 'Directions',
        text: 'Manage directions',
    },
    {
        id: 'Stops',
        text: 'Manage stops',
    },
    {
        id: 'Routes',
        text: 'Manage routes',
    },
    {
        id: 'VehicleTypes',
        text: 'Manage vehicle types',
    },
    {
        id: 'Icons',
        text: 'Manage icons',
    },
];


const NavigationPage: React.FC = () => {
    const { setSelectedModification } = useTravelContext()

    const handleItemPress = (selectedModification: string) => {
        // Access the item from the correctly grouped/sorted data
        if (selectedModification) {
            setSelectedModification(selectedModification);
            router.push("/(tabs)/dataList");
        }
    };

    return (
        <CollapsibleHeaderPage
            largeHeaderText="Add vehicle type, direction, stops, routes, or travels"
            smallHeaderText="Add Page"
        >
            <View style={styles.container}>
                <View style={styles.fillingContainer}></View>
                <View style={styles.buttonContainer}>
                    {navigationButtons.map((button) => (
                        <Button
                            color='#007bff'
                            key={button.text}
                            title={button.text}
                            style={styles.button}
                            textStyle={styles.buttonText}
                            onPress={() => handleItemPress(button.id)}
                        />
                    ))}
                </View>
            </View>
        </CollapsibleHeaderPage>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fillingContainer: {
        flex: 1,
    },
    buttonContainer: {
        gap: 10,
    },
    button: {
        borderWidth: 1,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default NavigationPage;