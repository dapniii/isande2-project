import { Flex, Text } from "@chakra-ui/react";
import { calcQuantityStatus } from "@/lib/dataHandler";

export function qtyStatusIndicator(qty, rp) {
    let status = calcQuantityStatus(qty, rp)

    if (status == "In Stock") 
        return (
            <Flex gap={1} border={"2px solid black"} borderRadius={"20px"} px={2}>
                <Text color={"green.300"}>⬤</Text>
                <Text>{status}</Text>
            </Flex> 
        )
    else if (status == "Low Stock")
        return (
            <Flex gap={1} border={"2px solid black"} borderRadius={"20px"} px={2}>
                <Text color={"yellow.300"}>⬤</Text>
                <Text>{status}</Text>
            </Flex> 
        )
    else if (status == "Out of Stock")
        return (
            <Flex gap={1} border={"2px solid black"} borderRadius={"20px"} px={2}>
                <Text color={"red.400"}>⬤ </Text>
                <Text>{status}</Text>
            </Flex> 
        )
    
    else return <Text>⬤ {status}</Text>
} 