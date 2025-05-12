import Button from "@/components/BaseButton";
import ModalTemplate from "@/components/ModalTemplate";
import useStopModal from "@/hooks/useStopModal";
import { BaseModalContentProps } from "@/src/types/ModalContentProps";
import { IconType } from "@/src/types/Travels";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome6'

export default function AddIconModal({ onSubmit, onCancel }: BaseModalContentProps) {
    const [icon, setIcon] = useState<IconType>({'name': 'xmark'})
    const [iconQuery, setIconQuery] = useState<string>('xmark')

    const handleAddPress = () => {
        onSubmit(icon);
    };

    const changeIcon = (text: string) => {
        if (!text) {
            setIconQuery(text)
        }
        else {
            setIconQuery(text)
            setIcon({...icon, 'name': text})
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Icon name (FontAwesome6):</Text>
            <View style={styles.inputContainer}>
                <Icon style={styles.icon} name={icon.name} size={32} />
                <TextInput
                    style={styles.input}
                    placeholder="e.g., train-subway"
                    value={iconQuery}
                    onChangeText={changeIcon}
                    autoFocus={true}
                />
            </View>

            <View style={styles.buttonRow}>
                <Button title='Cancel' color='#E0E0E0' onPress={onCancel} style={styles.cancelButton} textStyle={styles.cancelButtonText}></Button>
                <Button title='Add Icon' color='#0284f5' onPress={handleAddPress} style={styles.addButton} textStyle={styles.addButtonText}></Button>
            </View>
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
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputContainer:{
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
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