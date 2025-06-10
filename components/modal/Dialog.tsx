import React from 'react'
import { ModalProps, useWindowDimensions, View } from 'react-native'
import ModalTemplate from '../ModalTemplate'
import Button from '../button/BaseButton'
import Input from '../input/Input'

export default function DialogBase({ visible, onRequestClose, children, ...props }: ModalProps) {
    const { width } = useWindowDimensions()

    return (
        <ModalTemplate
            animationType="fade"

            visible={visible}
            onRequestClose={onRequestClose}
        >
            <ModalTemplate.Backdrop style={{ justifyContent: 'center', alignItems: 'center' }}>
                <ModalTemplate.Container style={{ maxWidth: width * 0.9 }}>
                    {children}
                </ModalTemplate.Container>
            </ModalTemplate.Backdrop>
        </ModalTemplate>
    )
}

export interface DialogButton {
    text: string
    onPress: () => void
    type?: 'add' | 'dismiss' | 'cancel'
}

export interface DialogContent {
    label: string
    content: string
    buttons?: DialogButton[]
}

function InformationBox({ label, content, buttons = [] }: DialogContent) {
    return (
        <View style={{ gap: 12 }}>
            <View style={{ gap: 5 }}>
                <Input.Title>{label}</Input.Title>
                <Input.ValueText style={{ minHeight: 75 }}>{content}</Input.ValueText>
            </View>
            <Button.Row>
                {buttons.map((button, index) => {
                    if (button.type === 'add') {
                        return (
                            <Button.Add key={index} label={button.text} onPress={button.onPress} />
                        )
                    } else if (button.type === 'cancel') {
                        return (
                            <Button.Cancel key={index} label={button.text} onPress={button.onPress} />
                        )
                    } else {
                        return (
                            <Button.Dismiss key={index} label={button.text} onPress={button.onPress} />
                        )
                    }
                })}
            </Button.Row>
        </View>
    )
}

DialogBase.Information = InformationBox