import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';
// Make sure the path is correct relative to your project structure
import CollapsibleHeaderPage from '@/components/CollapsibleHeaderPage'; // Adjust path as needed

const VehicleInputPage: React.FC = () => {
  const [vehicleType, setVehicleType] = useState('');
  const [otherInfo, setOtherInfo] = useState('');

  return (
    <CollapsibleHeaderPage
      largeHeaderText="Tell us about your vehicle. This information helps us tailor your experience."
      smallHeaderText="Vehicle Info" // Changed to be more generic if used elsewhere
      // You could add style props here if needed, e.g.:
      // containerStyle={{ backgroundColor: '#f5f5f5' }}
    >
      <View style={vehicleInputStyles.content}>
        <Text style={vehicleInputStyles.label}>Vehicle Type</Text>
        <TextInput
          style={vehicleInputStyles.input}
          value={vehicleType}
          onChangeText={setVehicleType}
          placeholder="e.g., Sedan, Truck, SUV, Motorcycle"
          placeholderTextColor="#888"
        />

        <Text style={[vehicleInputStyles.label, { marginTop: 20 }]}>Other Information</Text>
        <TextInput
          style={vehicleInputStyles.input}
          value={otherInfo}
          onChangeText={setOtherInfo}
          placeholder="e.g., Color, Year, Model"
          placeholderTextColor="#888"
        />
      </View>
    </CollapsibleHeaderPage>
  );
};

// --- Styles specific to the VehicleInputPage's content ---
const vehicleInputStyles = StyleSheet.create({
  // This padding is applied to the children content area
  content: {
      // No horizontal padding needed here, it's handled by scrollContentInner in CollapsibleHeaderPage
      // No paddingTop needed here either, also handled by scrollContentInner
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#f9f9f9',
  },
  dummyContent: {
    height: 600, // Make it tall enough to scroll
    backgroundColor: '#f0f0f0',
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
  }
});

export default VehicleInputPage;