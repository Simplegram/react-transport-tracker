import { Stop } from "./Travels"

export interface ModalProp {
    onSubmit: (data: any) => void;
    onCancel: () => void;
    stops?: Stop[]
}