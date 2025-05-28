import Button from '@/components/BaseButton'
import CollapsibleHeaderPage from '@/components/CollapsibleHeaderPage'
import Divider from '@/components/Divider'
import { useDataEditContext } from '@/context/DataEditContext'
import { useTheme } from '@/context/ThemeContext'
import { buttonStyles } from '@/src/styles/ButtonStyles'
import { router } from 'expo-router'
import React from 'react'
import { StyleSheet, View } from 'react-native'

interface ButtonConfig {
    id: string
    text: string
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
]


export default function NavigationPage() {
    const { theme } = useTheme()
    const { setEditCategory } = useDataEditContext()

    const handleItemPress = (editCategory: string) => {
        if (editCategory) {
            setEditCategory(editCategory)
            router.push("manage/datalist")
        }
    }

    return (
        <CollapsibleHeaderPage
            headerText="Data Manager"
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
                    title={'Manage settings'}
                    style={buttonStyles[theme].addButton}
                    textStyle={buttonStyles[theme].addButtonText}
                    onPress={() => router.push("manage/settings")}
                />
            </View>
        </CollapsibleHeaderPage>
    )
}

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
})