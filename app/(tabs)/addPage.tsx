import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Linking,
  Alert,
  ScrollView,
  Modal,
  Pressable,
  KeyboardAvoidingView,
} from 'react-native';
import CollapsibleHeaderPage from '@/components/CollapsibleHeaderPage'; // Adjust path as needed
import { router } from 'expo-router'; // Keep if needed elsewhere

// Import the specific modal content components
import AddDirectionModalContent from '@/components/add_modal/AddDirectionModalContent'; // Adjust path
import AddStopModalContent from '@/components/add_modal/AddStopModalContent'; // Adjust path
import AddVehicleTypeModalContent from '@/components/add_modal/AddVehicleTypeModalContent'; // Adjust path
// Import others as you create them...

import { BaseModalContentProps } from '@/src/types/ModalContentProps'; // Adjust path

// --- Define the specific handlers for adding each item type ---
// These functions will receive the *structured data* from the modal content components
const handleAddDirection = (data: { name: string }) => {
  console.log('Adding direction:', data.name);
  Alert.alert('Direction Added', `Direction "${data.name}" has been saved.`);
  // --- Your actual API/state logic here ---
};

const handleAddStop = (data: { name: string; location: string }) => {
  console.log('Adding stop:', data.name, 'Location:', data.location);
  Alert.alert('Stop Added', `Stop "${data.name}" at "${data.location}" has been saved.`);
  // --- Your actual API/state logic here ---
};

const handleAddRoute = (data: { name: string }) => { // Example: Assuming route is just a name
  console.log('Adding route:', data.name);
  Alert.alert('Route Added', `Route "${data.name}" has been saved.`);
  // --- Your actual API/state logic here ---
};

const handleAddVehicleType = (data: { name: string; type: string }) => {
  console.log('Adding vehicle type:', data.name, 'Category:', data.type);
  Alert.alert('Vehicle Type Added', `Vehicle Type "${data.name}" has been saved.`);
  // --- Your actual API/state logic here ---
};

const handleAddTravel = (data: { identifier: string; startTime: Date }) => { // Example: Assuming travel has identifier and time
    console.log('Adding travel:', data.identifier, 'Start Time:', data.startTime);
    Alert.alert('Travel Added', `Travel "${data.identifier}" starting at ${data.startTime.toLocaleString()} has been saved.`);
    // --- Your actual API/state logic here ---
};

// --- Define the configuration for each button and its modal content ---
interface ModalConfig {
    title: string;
    // This is the component that will be rendered inside the modal
    // It receives onSubmit and onCancel functions
    content: React.FC<BaseModalContentProps>;
    // This is the function called by NavigationPage AFTER
    // the content component calls its onSubmit prop
    onSubmitDataHandler: (data: any) => void;
}

interface ButtonConfig {
    text: string; // The button label
    modalConfig: ModalConfig; // The configuration for the modal opened by this button
}

const navigationButtons: ButtonConfig[] = [
  {
    text: 'Add direction',
    modalConfig: {
      title: 'Add Direction',
      content: AddDirectionModalContent, // Reference the component
      onSubmitDataHandler: handleAddDirection, // Reference the specific handler
    },
  },
  {
    text: 'Add stop',
    modalConfig: {
      title: 'Add Stop',
      content: AddStopModalContent, // Reference the component
      onSubmitDataHandler: handleAddStop, // Reference the specific handler
    },
  },
  {
    text: 'Add route',
    modalConfig: {
      title: 'Add Route',
      content: AddDirectionModalContent, // Reuse AddDirectionContent if it's just a name
      onSubmitDataHandler: handleAddRoute, // Reference the specific handler
    },
  },
  {
    text: 'Add vehicle type',
    modalConfig: {
      title: 'Add Vehicle Type',
      content: AddVehicleTypeModalContent, // Reference the component with picker
      onSubmitDataHandler: handleAddVehicleType, // Reference the specific handler
    },
  },
];


const NavigationPage: React.FC = () => {
  // State for controlling the modal visibility
  const [isModalVisible, setModalVisible] = useState(false);
  // State to hold the configuration for the currently active modal
  const [activeModalConfig, setActiveModalConfig] = useState<ModalConfig | null>(null);

  // Function to open the modal, storing the specific config
  const handleOpenModal = (config: ModalConfig) => {
    setActiveModalConfig(config); // Store the config for this button
    setModalVisible(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setModalVisible(false);
    // Use a timeout to clear the config *after* the modal animation finishes
    // This prevents rendering errors if the component unmounts too fast
    setTimeout(() => setActiveModalConfig(null), 100); // Adjust delay as needed
  };

  // Function called by the *specific content component* when its "Add" button is pressed
  const handleSubmitFromContent = (data: any) => {
    if (activeModalConfig?.onSubmitDataHandler) {
      // Call the specific handler defined in the config, passing the collected data
      activeModalConfig.onSubmitDataHandler(data);
    } else {
        console.error("No data handler defined for this modal config.");
        Alert.alert("Error", "Configuration error: Could not process data.");
    }
    // Always close the modal after handling submission
    handleCloseModal();
  };

  // We only render modal content if activeModalConfig exists
  const ModalContentComponent = activeModalConfig?.content;


  return (
    <CollapsibleHeaderPage
      largeHeaderText="Add vehicle type, direction, stops, routes, or travels"
      smallHeaderText="Add Page"
    >
      <View>
        <View style={pageStyles.buttonContainer}>
          {navigationButtons.map((button) => (
              <TouchableOpacity
                  key={button.text} // Use text as key
                  style={pageStyles.button}
                  // Pass the entire modalConfig object to the handler
                  onPress={() => handleOpenModal(button.modalConfig)}
                  activeOpacity={0.8}
              >
                  <Text style={pageStyles.buttonText}>{button.text}</Text>
              </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* --- The Modal Component --- */}
      {/* Render the modal only if activeModalConfig exists or manage visibility separately */}
      <Modal
        animationType="slide" // Slide from the bottom
        transparent={true} // Allow background content to show
        visible={isModalVisible} // Control visibility with state
        onRequestClose={handleCloseModal} // Handle hardware back button on Android
      >
        {/* Pressable backdrop to close modal on tap outside */}
        <Pressable style={modalStyles.backdrop} onPress={handleCloseModal}>
           {/* KeyboardAvoidingView to push content up when keyboard appears */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust behavior based on platform
            style={modalStyles.keyboardAvoidingContainer}
          >
             {/* This Pressable prevents taps on the modal content from closing it */}
             {/* The modalContent styled View provides the white background, padding, etc. */}
            <Pressable style={modalStyles.modalContent} onPress={(e) => e.stopPropagation()}>
                {/* Render the title from the active config */}
                {activeModalConfig?.title && (
                    <Text style={modalStyles.modalTitle}>{activeModalConfig.title}</Text>
                )}

                {/* Render the specific content component for the active modal */}
                {/* Pass the onSubmit and onCancel handlers down as props */}
                {ModalContentComponent ? (
                    <ModalContentComponent
                        onSubmit={handleSubmitFromContent} // This will be called by the content component's "Add" button
                        onCancel={handleCloseModal}      // This will be called by the content component's "Cancel" button
                    />
                ) : (
                    // Optional: Loading or empty state if content isn't ready
                    <Text>Loading...</Text>
                )}

            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
      {/* --- End Modal Component --- */}

    </CollapsibleHeaderPage>
  );
};

// --- Styles specific to the NavigationPage's content ---
const pageStyles = StyleSheet.create({
  buttonContainer: {
    // Existing styles
  },
  button: {
    backgroundColor: '#1E88E5',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12, // Space between stacked buttons
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});

// --- Styles specific to the Modal Overlay and the MAIN content box ---
const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    justifyContent: 'flex-end', // Push the modal content to the bottom
  },
  keyboardAvoidingContainer: {
     // Adjust behavior based on platform. For bottom sheet,
     // often setting flex: 0 or letting content size it works,
     // but 'padding' or 'height' behavior is key.
     // flex: 1, // Use flex:1 if the content area itself needs to expand
  },
  modalContent: {
    backgroundColor: '#fff', // White background for the dialog box
    padding: 20, // Padding around the specific content component
    borderTopLeftRadius: 20, // Rounded corners at the top
    borderTopRightRadius: 20,
    width: '100%', // Make it full width
    // Add elevation for Android shadow if needed
    ...Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
        },
        android: {
            elevation: 10,
        },
    }),
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15, // Space below title, above content component
    textAlign: 'center',
  },
});

export default NavigationPage;