import { createContext, useContext, useState } from "react"

export const ScrollContext = createContext<boolean>(false)

interface ModalContextValue {
    modalData: any | undefined
    setModalData: any | undefined
}

interface ModalProviderProps {
    children: React.ReactNode
}

export const ModalContext = createContext<ModalContextValue | undefined>(undefined)

export const ModalProvider = ({ children }: ModalProviderProps) => {
    const [modalData, setModalData] = useState<string | undefined>(undefined)

    return (
        <ModalContext.Provider value={{
            modalData, setModalData
        }}>
            {children}
        </ModalContext.Provider>
    )
}

export const useModalContext = () => {
    const modalData = useContext(ModalContext)

    if (modalData === undefined) {
        throw new Error('useTravelContext must be used within a TravelProvider')
    }

    return modalData
}