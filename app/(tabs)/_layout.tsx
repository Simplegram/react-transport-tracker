import { TravelContext } from "@/context/PageContext";
import { AuthProvider } from "@/provider/AuthProvider";
import { DataItem } from "@/src/types/Travels";
import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useState } from "react";

const TabsLayout = () => {
  const [selectedItem, setSelectedItem] = useState<DataItem | undefined>(undefined);

  return (
    <TravelContext.Provider value={{ selectedItem, setSelectedItem }}>
      <Tabs>
          <Tabs.Screen 
              name="mainMenu" 
              options={{ 
                  title: "Home", 
                  headerShown: false,
                  tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
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
                  title: "Add", 
                  headerShown: false,
                  tabBarIcon: ({ color }) => <FontAwesome size={28} name="plus" color={color} />,
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
                  tabBarIcon: ({ color }) => <FontAwesome size={28} name="plus" color={color} />,
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