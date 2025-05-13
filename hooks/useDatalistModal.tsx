import AddIconModal from "@/components/modal/addModal/AddIconModal";
import { Direction, IconType, Stop } from "@/src/types/Travels";
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import useModifyTravelData from "./useModifyTravelData";
import AddVehicleTypeModal from "@/components/modal/addModal/AddVehicleTypeModal";
import EditVehicleTypeModal from "@/components/modal/editModal/EditVehicleTypeModal";
import { EditableRoute, EditableStop, EditableVehicleType } from "@/src/types/EditableTravels";
import EditStopModal from "@/components/modal/editModal/EditStopModal";
import EditRouteModal from "@/components/modal/editModal/EditRouteModal";
import EditDirectionModal from "@/components/modal/editModal/EditDirectionModal";
import AddDirectionModal from "@/components/modal/addModal/AddDirectionModal";
import { AddableDirection, AddableIconType, AddableRoute, AddableStop, AddableVehicleType } from "@/src/types/AddableTravels";
import AddStopModal from "@/components/modal/addModal/AddStopModal";
import AddRouteModal from "@/components/modal/addModal/AddRouteModal";

interface ModalConfig {
    title: string;
    content: any;
    onSubmitDataHandler: (data: any) => void;
}

interface ModalConfigMap {
    [key: string]: ModalConfig;
}

export default function useDatalistModal(refetch: () => void) {
    const { 
        addDirection, editDirection,
        addStop, editStop,
        addIcon,
        addVehicleType, editVehicleType,
        addRoute, editRoute
    } = useModifyTravelData()

    const [activeModalConfig, setActiveModalConfig] = useState<ModalConfig | undefined>(undefined);

    const handleAddDirection = (data: AddableDirection) => {
        addDirection(data)
        refetch()
        Alert.alert('Vehicle Type Added', `Vehicle Type "${data.name}" has been saved.`);
    };

    const handleAddStop = (data: AddableStop) => {
        addStop(data)
        refetch()
        Alert.alert('Vehicle Type Added', `Vehicle Type "${data.name}" has been saved.`);
    };

    const handleAddRoute = (data: AddableRoute) => {
        addRoute(data)
        refetch()
        Alert.alert('Vehicle Type Added', `Vehicle Type "${data.name}" has been saved.`);
    };

    const handleAddVehicleType = (data: AddableVehicleType) => {
        addVehicleType(data)
        refetch()
        Alert.alert('Vehicle Type Added', `Vehicle Type "${data.name}" has been saved.`);
    };

    const handleAddIcon = (data: AddableIconType) => {
        addIcon(data)
        refetch()
        Alert.alert('Icon Added', `Icon "${data.name}" has been saved.`);
    };

    // ---

    const handleEditDirection = (data: Direction) => {
        editDirection(data)
        refetch()
        Alert.alert('Stop Changed', `Stop "${data.name}" has been saved.`);
    };

    const handleEditStop = (data: EditableStop) => {
        editStop(data)
        refetch()
        Alert.alert('Stop Changed', `Stop "${data.name}" has been saved.`);
    };

    const handleEditVehicleType = (data: EditableVehicleType) => {
        editVehicleType(data)
        refetch()
        Alert.alert('Vehicle Type Changed', `Vehicle Type "${data.name}" has been saved.`);
    };

    const handleEditRoute = (data: EditableRoute) => {
        editRoute(data)
        refetch()
        Alert.alert('Route Changed', `Route "${data.name}" has been saved.`);
    };

    const addModalConfigs: ModalConfigMap = {
        "Directions": {
            title: 'Add Direction',
            content: AddDirectionModal,
            onSubmitDataHandler: handleAddDirection
        },
        "Stops": {
            title: 'Add Stop',
            content: AddStopModal,
            onSubmitDataHandler: handleAddStop
        },
        "Routes": {
            title: 'Add Route',
            content: AddRouteModal,
            onSubmitDataHandler: handleAddRoute
        },
        "VehicleTypes": {
            title: 'Add Vehicle Type',
            content: AddVehicleTypeModal,
            onSubmitDataHandler: handleAddVehicleType
        },
        "Icons": {
            title: 'Add Icons',
            content: AddIconModal,
            onSubmitDataHandler: handleAddIcon,
        },
    };

    const editModalConfigs: ModalConfigMap = {
        "Directions": {
            title: 'Edit Directions',
            content: EditDirectionModal,
            onSubmitDataHandler: handleEditDirection
        },
        "Stops": {
            title: 'Edit Stops',
            content: EditStopModal,
            onSubmitDataHandler: handleEditStop
        },
        "Routes": {
            title: 'Edit Routes',
            content: EditRouteModal,
            onSubmitDataHandler: handleEditRoute
        },
        "VehicleTypes": {
            title: 'Edit Vehicle Type',
            content: EditVehicleTypeModal,
            onSubmitDataHandler: handleEditVehicleType
        },
    };

    const setActiveModal = useCallback((dataType: string) => {
        setActiveModalConfig(addModalConfigs[dataType])
    }, [])

    const setActiveEditModal = useCallback((dataType: string) => {
        setActiveModalConfig(editModalConfigs[dataType])
    }, [])

    return {
        activeModalConfig, setActiveModalConfig,
        setActiveModal, setActiveEditModal
    }
}