import Button from '@/components/BaseButton';
import CollapsibleHeaderPage from '@/components/CollapsibleHeaderPage';
import Divider from '@/components/Divider';
import { useTravelContext } from '@/context/PageContext';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/provider/AuthProvider';
import { buttonStyles } from '@/src/styles/ButtonStyles';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface ButtonConfig {
    id: string
    text: string;
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
    const { theme, setTheme } = useTheme()
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

    const handleThemeChange = () => {
        if (theme === 'light') setTheme('dark')
        else setTheme('light')
    }

    return (
        <CollapsibleHeaderPage
            headerText="Add vehicle type, direction, stops, or routes"
        >
            <View style={styles.container}>
                <View style={styles.fillingContainer} />
                <View style={styles.buttonContainer}>
                    {navigationButtons.map((button) => (
                        <Button
                            key={button.text}
                            title={button.text}
                            style={buttonStyles[theme].addButton}
                            textStyle={buttonStyles[theme].addButtonText}
                            onPress={() => handleItemPress(button.id)}
                        />
                    ))}
                </View>
                <Divider />
                <Button
                    title={`Enable ${theme === 'light' ? 'dark' : 'light'} mode`}
                    style={buttonStyles[theme].addButton}
                    textStyle={buttonStyles[theme].addButtonText}
                    onPress={handleThemeChange}
                />
                <Divider />
                <Button
                    style={buttonStyles[theme].redButton}
                    textStyle={buttonStyles[theme].addButtonText}
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
});

export default NavigationPage;