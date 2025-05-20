import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Platform,
    Text,
} from 'react-native';
import CollapsibleHeaderPage from '@/components/CollapsibleHeaderPage'; // Adjust path as needed
import { router } from 'expo-router'; // Keep if needed elsewhere

import { useTravelContext } from '@/context/PageContext';
import Button from '@/components/BaseButton';
import { useAuth } from '@/provider/AuthProvider';
import Divider from '@/components/Divider';

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

    const { signOut } = useAuth()

    const handleItemPress = (selectedModification: string) => {
        if (selectedModification) {
            setSelectedModification(selectedModification);
            router.push("/(tabs)/dataList");
        }
    };

    const handleLogout = () => {
        signOut()
        router.push("/");
    };

    return (
        <CollapsibleHeaderPage
            headerText="Add vehicle type, direction, stops, or routes"
        >
            <View style={styles.container}>
                <View style={styles.fillingContainer} />
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
                <Divider />
                <Button
                    title='Light Mode'
                    color='#007bff'
                    style={styles.button}
                    textStyle={styles.buttonText}
                />
                <Divider />
                <Button
                    color='#f0473e'
                    style={styles.button}
                    textStyle={styles.buttonText}
                    onPress={handleLogout}
                >Logout</Button>
            </View>
        </CollapsibleHeaderPage>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 10,
    },
    fillingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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