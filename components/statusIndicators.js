import { Flex, Text } from "@chakra-ui/react";

export function qtyStatusIndicator(status) {

    if (status == "In Stock") {
        return (
            <Flex gap={1} bg={"rgba(104, 211, 145, 0.35)"} borderRadius={"30em"} px={3.5} py={0.3}>
                <Text color={"green.400"} fontWeight={"bold"}>{status}</Text>
            </Flex> 
        )
    }
    else if (status == "Low Stock") {
        return (
            <Flex gap={1} bg={"rgba(246, 224, 94, 0.35)"} borderRadius={"30em"} px={3.5} py={0.3}>
                <Text color={"yellow.400"} fontWeight={"bold"}>{status}</Text>
            </Flex> 
        )
    }
    else if (status == "Out of Stock") {
        return (
            <Flex gap={1} bg={"rgba(245, 101, 101, 0.3)"} borderRadius={"30em"} px={3.5} py={0.3}>
                <Text color={"red.400"} fontWeight={"bold"}>{status}</Text>
            </Flex> 
        )
    }

    else return <Text>{status}</Text>
}

