import { Icon } from "react-native-vector-icons/Icon";
import { Stop } from "./Travels"

export interface ModalProp {
    onSubmit: (data: any) => void;
    onCancel: () => void;
    stops?: Stop[]
}

export interface VehicleTypeModalProp {
    onSubmit: (data: any) => void;
    onCancel: () => void;
    icons?: Icon[]
}