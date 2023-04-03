import { Flex, Text } from "@chakra-ui/react";

export function qtyStatusIndicator(status) {

    if (status == "In Stock") {
        return (
            <Flex gap={1} bg={"rgba(37, 198, 133, 0.3)"} borderRadius={"30em"} px={3.5} py={0.3}>
                <Text color={"#25C685"} fontWeight={"bold"}>{status}</Text>
            </Flex> 
        )
    }
    else if (status == "Low Stock") {
        return (
            <Flex gap={1} bg={"rgba(255, 192, 0, 0.3)"} borderRadius={"30em"} px={3.5} py={0.3}>
                <Text color={"#FFC000"} fontWeight={"bold"}>{status}</Text>
            </Flex> 
        )
    }
    else if (status == "Out of Stock") {
        return (
            <Flex gap={1} bg={"rgba(248, 58, 58, 0.3)"} borderRadius={"30em"} px={3.5} py={0.3}>
                <Text color={"#F83A3A"} fontWeight={"bold"}>{status}</Text>
            </Flex> 
        )
    }

    else return <Text>{status}</Text>
}

export function vehicleStatusIndicator(status) {
    if (status == "Active") {
        return (
            <Flex gap={1} bg={"rgba(37, 198, 133, 0.35)"} borderRadius={"30em"} px={3.5} py={0.3} w={"40%"} justifyContent={"center"}>
                <Text color={"#25C685"} fontWeight={"bold"} fontSize={"lg"}>{status}</Text>
            </Flex> 
        )
    }
    else if (status == "Inactive") {
        return (
            <Flex gap={1} bg={"rgba(248, 58, 58, 0.3)"} borderRadius={"30em"} px={3.5} py={0.3} w={"40%"} justifyContent={"center"}>
                <Text color={"#F83A3A"} fontWeight={"bold"} fontSize={"lg"}>{status}</Text>
            </Flex> 
        )
    }
    else if (status == "Repair") {
        return (
            <Flex gap={1} bg={"rgba(255, 192, 0, 0.35)"} borderRadius={"30em"} px={3.5} py={0.3} w={"40%"} justifyContent={"center"}>
                <Text color={"#FFC000"} fontWeight={"bold"} fontSize={"lg"}>{status}</Text>
            </Flex> 
        )
    }
    else if (status == "Travelling") {
        return (
            <Flex gap={1} bg={"rgba(0, 93, 242, 0.35)"} borderRadius={"30em"} px={3.5} py={0.3} w={"40%"} justifyContent={"center"}>
                <Text color={"#005DF2"} fontWeight={"bold"} fontSize={"lg"}>{status}</Text>
            </Flex> 
        )
    }

    else return <Text>{status}</Text>
}

export function joStatusIndicator(status) {
    if (status == "Pending Parts") {
        return (
            <Flex 
                gap={1} 
                bg={"rgba(248, 58, 58, 0.2)"} 
                borderRadius={"30em"} 
                px={3} 
                py={0.3} 
                w={"10em"} 
                h={"2em"}
                justifyContent={"center"} 
                alignItems={"center"}
            >
                <Text color={"rgba(248, 58, 58, 1)"} fontWeight={"bold"} >{status}</Text>
            </Flex> 
        )
    }
    else if (status == "Open") {
        return (
            <Flex 
                gap={1} 
                bg={"rgba(248, 58, 58, 0.2)"} 
                border={"2px solid rgba(248, 58, 58, 0.7)"} 
                borderRadius={"30em"} 
                px={3} 
                py={0.3} 
                w={"10em"} 
                h={"2em"}
                justifyContent={"center"} 
                alignItems={"center"}
            >
                <Text color={"rgba(248, 58, 58, 1)"} fontWeight={"bold"}>{status}</Text>
            </Flex> 
        )
    }
    else if (status == "For Review") {
        return (
            <Flex 
                gap={1} 
                bg={"rgba(37, 198, 133, 0.2)"} 
                border={"2px solid rgba(37, 198, 133, 0.7)"} 
                borderRadius={"30em"} 
                px={3} 
                py={0.3} 
                w={"10em"} 
                h={"2em"}
                justifyContent={"center"} 
                alignItems={"center"}
            >
                <Text color={"rgba(248, 58, 58, 1)"} fontWeight={"bold"}>{status}</Text>
            </Flex> 
        )
    }
    else if (status == "Completed") {
        return (
            <Flex 
                gap={1} 
                bg={"rgba(37, 198, 133, 0.3)"} 
                borderRadius={"30em"} 
                px={3} 
                py={0.3} 
                w={"10em"} 
                h={"2em"}
                justifyContent={"center"} 
                alignItems={"center"}
            >
                <Text color={"rgba(248, 58, 58, 1)"} fontWeight={"bold"}>{status}</Text>
            </Flex> 
        )
    }
}


