import { colors } from "@/const/color"
import { ModalContext } from "@/context/ModalContext"
import { TravelContext } from "@/context/PageContext"
import { SupabaseProvider } from "@/context/SupabaseContext"
import { useTheme } from "@/context/ThemeContext"
import { statusBarStyles } from "@/src/styles/Styles"
import { DataItem } from "@/src/types/Travels"
import { Tabs, usePathname } from "expo-router"
import { useState } from "react"
import { StatusBar } from "react-native"
import Icon from 'react-native-vector-icons/FontAwesome6'

const TabsLayout = () => {
    const { theme } = useTheme()

    const barColor = theme === 'light' ? colors.text.dimWhite : colors.background.black
    const iconColor = theme === 'light' ? colors.background.black : colors.text.dimmerWhite2

    const [selectedItem, setSelectedItem] = useState<DataItem | undefined>(undefined)
    const [selectedTravelItems, setSelectedTravelItems] = useState<DataItem[] | undefined>(undefined)
    const [selectedModification, setSelectedModification] = useState<string | undefined>(undefined)

    const [modalData, setModalData] = useState<string | undefined>(undefined)

    const getDisplayValue = () => {
        const paths = ["/manage/settings", "/main/editTravel", "/main/travelDetail"]

        const currentPathname = usePathname()
        if (paths.indexOf(currentPathname) <= -1) return "flex"

        return "none"
    }

    return (
        <SupabaseProvider>
            <TravelContext.Provider value={{
                selectedItem,
                setSelectedItem,
                selectedModification,
                setSelectedModification,
                selectedTravelItems,
                setSelectedTravelItems
            }}>
                <ModalContext.Provider value={{ modalData, setModalData }}>
                    <StatusBar
                        backgroundColor={statusBarStyles[theme]}
                    />
                    <Tabs
                        screenOptions={{
                            tabBarStyle: {
                                height: 60,
                                backgroundColor: barColor,
                                borderTopWidth: 0,
                                display: getDisplayValue()
                            },
                            tabBarLabelStyle: {
                                fontSize: 13,
                                fontWeight: 'bold',
                            },
                            tabBarActiveTintColor: colors.appBlue,
                            tabBarInactiveTintColor: iconColor,
                            headerShown: false,
                            sceneStyle: {
                                backgroundColor: barColor
                            }
                        }}
                        backBehavior="order"
                    >
                        <Tabs.Screen
                            name="main"
                            options={{
                                title: "Home",
                                tabBarIcon: ({ color }) => <Icon size={24} name="house" color={color} />,
                            }}
                        />
                        <Tabs.Screen
                            name="addTravel"
                            options={{
                                title: "Add",
                                tabBarIcon: ({ color }) => <Icon size={24} name="square-plus" color={color} />,
                            }}
                        />
                        <Tabs.Screen
                            name="manage"
                            options={{
                                title: "Modify",
                                tabBarIcon: ({ color }) => <Icon size={24} name="pen-to-square" color={color} />,
                            }}
                        />
                    </Tabs>
                </ModalContext.Provider>
            </TravelContext.Provider>
        </SupabaseProvider>
    )
}

export default TabsLayout