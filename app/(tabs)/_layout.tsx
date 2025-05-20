import { TravelContext } from "@/context/PageContext";
import { DataItem } from "@/src/types/Travels";
import Icon from 'react-native-vector-icons/FontAwesome6'
import { Tabs } from "expo-router";
import { useState } from "react";
import { ModalContext } from "@/context/ModalContext";
import { SupabaseProvider } from "@/context/SupabaseContext";
import { ThemeProvider } from "@/context/ThemeContext";

const TabsLayout = () => {
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
                    <ThemeProvider>
                        <Tabs>
                            <Tabs.Screen
                                name="mainMenu"
                                options={{
                                    title: "Home",
                                    headerShown: false,
                                    tabBarIcon: ({ color }) => <Icon size={24} name="house" color={color} />,
                                    tabBarStyle: {
                                        height: 60
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
                                    tabBarIcon: ({ color }) => <Icon size={24} name="square-plus" color={color} />,
                                    tabBarStyle: {
                                        height: 60
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
                                    tabBarIcon: ({ color }) => <Icon size={24} name="pen-to-square" color={color} />,
                                    tabBarStyle: {
                                        height: 60
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
                                    tabBarIcon: ({ color }) => <Icon size={24} name="plus" color={color} />,
                                    tabBarStyle: {
                                        height: 60
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
                                    tabBarIcon: ({ color }) => <Icon size={24} name="plus" color={color} />,
                                    tabBarStyle: {
                                        height: 60
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
                                    tabBarIcon: ({ color }) => <Icon size={24} name="plus" color={color} />,
                                    tabBarStyle: {
                                        height: 60
                                    },
                                    tabBarLabelStyle: {
                                        fontSize: 13
                                    },
                                    href: null
                                }} />
                        </Tabs>
                    </ThemeProvider>
                </ModalContext.Provider>
            </TravelContext.Provider>
        </SupabaseProvider>
    )
};

export default TabsLayout;