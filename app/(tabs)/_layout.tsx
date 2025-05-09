import { TravelContext } from "@/context/PageContext";
import { DataItem } from "@/src/types/Travels";
import Icon from 'react-native-vector-icons/FontAwesome6'
import { Tabs } from "expo-router";
import { useState } from "react";

const TabsLayout = () => {
  const [selectedItem, setSelectedItem] = useState<DataItem | undefined>(undefined);
  const [selectedModification, setSelectedModification] = useState<string | undefined>(undefined)

  return (
    <TravelContext.Provider value={{ selectedItem, selectedModification, setSelectedItem, setSelectedModification }}>
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
              name="editTravelItem" 
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
      </Tabs>
    </TravelContext.Provider>
  )
};

export default TabsLayout;