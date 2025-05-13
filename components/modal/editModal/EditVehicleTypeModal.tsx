import Button from "@/components/BaseButton";
import { useModalContext } from "@/context/ModalContext";
import useGetTravelData from "@/hooks/useGetTravelData";
import useLoading from "@/hooks/useLoading";
import { EditableVehicleType } from "@/src/types/EditableTravels";
import { BaseModalContentProps } from "@/src/types/ModalContentProps";
import { sortByIdToFront } from "@/src/utils/utils";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome6'

export default function EditVehicleTypeModal({ onSubmit, onCancel }: BaseModalContentProps) {
  const { modalData: data } = useModalContext()

  const { icons, getIcons } = useGetTravelData()

  const [vehicleType, setVehicleType] = useState<EditableVehicleType>(data)
  const savedVehicleTypeId = useRef(vehicleType.icon_id)

  const { loading } = useLoading()

  useEffect(() => {
    getIcons()
  }, [icons])

  const handleOnSubmit = () => {
    onSubmit(vehicleType);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.label}>Loading...</Text>
      ) : (
        <>
          <View style={styles.inputContainer}>
            <View>
              <Text style={styles.label}>Name:</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Standard Bus"
                value={vehicleType.name}
                onChangeText={text => setVehicleType({ ...vehicleType, "name": text })}
              />
            </View>

            <View style={{
              flexDirection: 'column',
            }}>
              <Text style={styles.label}>Icon:</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.iconScrollView}
                keyboardShouldPersistTaps={"always"}
              >
                {sortByIdToFront(icons, savedVehicleTypeId.current).map((icon) => (
                  <TouchableOpacity
                    key={icon.id}
                    style={[
                      styles.iconContainer,
                      vehicleType.icon_id === icon.id && styles.selectedIconContainer,
                    ]}
                    onPress={() => setVehicleType({ ...vehicleType, icon_id: icon.id })}
                  >
                    <Icon name={icon.name} size={20}></Icon>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <Button title='Cancel' color='#E0E0E0' onPress={onCancel} style={styles.cancelButton} textStyle={styles.cancelButtonText}></Button>
            <Button title='Edit Type' color='#0284f5' onPress={handleOnSubmit} style={styles.addButton} textStyle={styles.addButtonText}></Button>
          </View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {

  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputContainer: {
    gap: 10,
    paddingVertical: 10,
  },
  icon: {
    paddingLeft: 5,
    alignItems: 'center',
  },
  iconScrollView: {
    marginBottom: 20,
  },
  iconContainer: {
    width: 55,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 5,
    marginRight: 10, // Space between icons
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIconContainer: {
    borderColor: '#0284f5', // Highlight selected icon
    backgroundColor: '#e3f2fd', // Light background for selected
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    gap: 10,
  },
  addButton: {
    backgroundColor: '#1E88E5',
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});