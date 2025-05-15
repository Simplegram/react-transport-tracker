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

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

interface Props {
    children: React.ReactNode
    isModalVisible: boolean
    title?: string
    handleCloseModal: () => void
}

export default function ModalTemplate({ children, isModalVisible, title = "Editor", handleCloseModal }: Props) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={handleCloseModal}
            statusBarTranslucent={true}
        >
            <Pressable style={modalStyles.backdrop} onPress={handleCloseModal}>
                <Pressable style={modalStyles.modalContent} onPress={(e) => e.stopPropagation()}>
                    <Text style={modalStyles.modalTitle}>{title}</Text>
                    <KeyboardAwareScrollView enableOnAndroid={true} keyboardShouldPersistTaps={'always'}>
                        {children}
                    </KeyboardAwareScrollView>
                </Pressable>
            </Pressable>
        </Modal>
    )
}

const modalStyles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    keyboardAvoidingContainer: {

    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: '100%',
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
        marginBottom: 15,
        textAlign: 'center',
    },
});