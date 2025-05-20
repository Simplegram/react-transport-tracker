import { TravelContext } from "@/context/PageContext";
import { DataItem } from "@/src/types/Travels";
import Icon from 'react-native-vector-icons/FontAwesome6'
import { Tabs } from "expo-router";
import { useState } from "react";
import { ModalContext } from "@/context/ModalContext";
import { SupabaseProvider } from "@/context/SupabaseContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { StatusBar } from "react-native";
import { statusBarStyles } from "@/src/styles/Styles";
import { colors } from "@/const/color";

const TabsLayout = () => {
    const { theme } = useTheme()

    const barColor = theme === 'light' ? colors.background.white : colors.background.black
    const iconColor = theme === 'light' ? colors.background.black : colors.background.darkWhite

    const [selectedItem, setSelectedItem] = useState<DataItem | undefined>(undefined);
    const [selectedTravelItems, setSelectedTravelItems] = useState<DataItem[] | undefined>(undefined);
    const [selectedModification, setSelectedModification] = useState<string | undefined>(undefined)

    const [modalData, setModalData] = useState<string | undefined>(undefined)

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
                    <Tabs>
                        <Tabs.Screen
                            name="mainMenu"
                            options={{
                                title: "Home",
                                headerShown: false,
                                tabBarIcon: ({ color }) => <Icon size={24} name="house" color={iconColor} />,
                                tabBarStyle: {
                                    height: 60,
                                    backgroundColor: barColor
                                },
                                tabBarLabelStyle: {
                                    fontSize: 13
                                }
                            }} />
                        <Tabs.Screen
                            name="addTravel"
                            options={{
                                title: "Add",
                                headerShown: false,
                                tabBarIcon: ({ color }) => <Icon size={24} name="square-plus" color={iconColor} />,
                                tabBarStyle: {
                                    height: 60,
                                    backgroundColor: barColor
                                },
                                tabBarLabelStyle: {
                                    fontSize: 13
                                }
                            }} />
                        <Tabs.Screen
                            name="addPage"
                            options={{
                                title: "Modify",
                                headerShown: false,
                                tabBarIcon: ({ color }) => <Icon size={24} name="pen-to-square" color={iconColor} />,
                                tabBarStyle: {
                                    height: 60,
                                    backgroundColor: barColor
                                },
                                tabBarLabelStyle: {
                                    fontSize: 13
                                }
                            }} />
                        <Tabs.Screen
                            name="editTravel"
                            options={{
                                title: "Add",
                                headerShown: false,
                                tabBarIcon: ({ color }) => <Icon size={24} name="plus" color={iconColor} />,
                                tabBarStyle: {
                                    height: 60,
                                    backgroundColor: barColor
                                },
                                tabBarLabelStyle: {
                                    fontSize: 13
                                },
                                href: null
                            }} />
                        <Tabs.Screen
                            name="dataList"
                            options={{
                                title: "Add",
                                headerShown: false,
                                tabBarIcon: ({ color }) => <Icon size={24} name="plus" color={iconColor} />,
                                tabBarStyle: {
                                    height: 60,
                                    backgroundColor: barColor
                                },
                                tabBarLabelStyle: {
                                    fontSize: 13
                                },
                                href: null
                            }} />
                        <Tabs.Screen
                            name="travelDetail"
                            options={{
                                title: "Add",
                                headerShown: false,
                                tabBarIcon: ({ color }) => <Icon size={24} name="plus" color={iconColor} />,
                                tabBarStyle: {
                                    height: 60,
                                    backgroundColor: barColor
                                },
                                tabBarLabelStyle: {
                                    fontSize: 13
                                },
                                href: null
                            }} />
                    </Tabs>
                </ModalContext.Provider>
            </TravelContext.Provider>
        </SupabaseProvider>
    )
};

export default TabsLayout;