import { 
    Grid,
    GridItem,
    Flex,
    Text,
} from "@chakra-ui/react"
import { EditButton } from "@/components/buttons"
import { Router, useRouter } from "next/router"

function createIdRow(title, value) {
    return(
        <Flex w={"100%"} borderY={"1px ridge #d3d0cf"} >
            <Flex 
                w={"50%"} justifyContent={"end"} px={"3"} py={"1.5"}
                borderRight={"1px ridge #d3d0cf"}
                
            >
                <Text fontWeight={"bold"}>{title}</Text>
            </Flex>
            <Flex borderLeft={"1px ridge #d3d0cf"} w={"50%"} px={"3"} py={"1.5"}>
                <Text>{value}</Text>
            </Flex>
        </Flex>
    )
}

function ViewVehicleLayout ({data}) {
    const router = useRouter()

    function navToEdit() {
        router.push({
            pathname: `/vehicles/edit`,
            query: {
                plate: data.plateNumber
            }
        })
    }

    return (
        // Main container
        <Flex gap={5}>
            {/* Left column */}
            <Flex w={"60%"} bg={"white"} boxShadow={"lg"} borderRadius={5} flexDirection={"column"}>
                <Flex justifyContent={"space-between"} alignItems={"center"} px={3} py={2}>
                    <Text fontSize={"xl"} fontWeight={"bold"}>Specs</Text>
                    <EditButton title={"Edit"} clickFunction={navToEdit} />
                </Flex>
                
                {createIdRow("Model", data.model)}
                {createIdRow("Vehicle Type", data.vehicleType)}
                {createIdRow("Brand", data.brand)}
                {createIdRow("Manufacturing Year", data.manufacturingYear)}
                {createIdRow("Transmission", data.transmission)}
                {createIdRow("Engine Number", data.engineNumber)}
                {createIdRow("Engine Type", data.engineType)}
                {createIdRow("Chassis", data.chassis)}
            </Flex>

            {/* Right column */}
            <Flex w={"40%"} flexDirection={"column"} gap={3}>
                {/* Issues */}
                <Flex bg={"white"} boxShadow={"lg"} borderRadius={5} flexDirection={"column"}>
                    <Flex alignItems={"center"} px={3} py={2} borderBottom={"1px ridge #d3d0cf"}>
                        <Text fontSize={"xl"} fontWeight={"bold"}>Issues</Text> 
                    </Flex>
                    
                </Flex>

                {/* Reminders */}
                <Flex bg={"white"} boxShadow={"lg"} borderRadius={5} flexDirection={"column"}>
                    <Flex alignItems={"center"} px={3} py={2} borderBottom={"1px ridge #d3d0cf"}>
                        <Text fontSize={"xl"} fontWeight={"bold"}>Reminders</Text> 
                    </Flex>

                    {createIdRow("Insurance Expiry Date", data.expiry)}
                    {createIdRow("Maintenance Schedule", "Date of next maintenance uwu")}
                </Flex>
            </Flex>

        </Flex>
    )
}

export default ViewVehicleLayout