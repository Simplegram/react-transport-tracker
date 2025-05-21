import { useTheme } from '@/context/ThemeContext';
import { modalElementStyles, modalStyles } from '@/src/styles/ModalStyles';
import {
    Modal,
    Pressable,
    Text
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface Props {
    children: React.ReactNode
    isModalVisible: boolean
    title?: string
    handleCloseModal: () => void
}

export default function ModalTemplate({ children, isModalVisible, title = "Editor", handleCloseModal }: Props) {
    const { theme } = useTheme()

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={handleCloseModal}
            statusBarTranslucent={true}
        >
            <Pressable style={modalStyles[theme].modalBackdrop} onPress={handleCloseModal}>
                <Pressable style={modalStyles[theme].modalContainer} onPress={(e) => e.stopPropagation()}>
                    <Text style={modalElementStyles[theme].title}>{title}</Text>
                    <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'}>
                        {children}
                    </KeyboardAwareScrollView>
                </Pressable>
            </Pressable>
        </Modal>
    )
}