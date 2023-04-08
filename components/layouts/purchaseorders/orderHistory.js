import React from 'react'
import {
    Card,
    CardHeader,
    CardBody,
    Text,
    Flex
} from "@chakra-ui/react"
import { 
    progressPath,
    postedGray,
    postedColor,
    approvedGray,
    approvedColor,
    ongoingGray,
    ongoingColor,
    purchasedGray,
    purchasedColor,
    deliveredGray,
    deliveredColor,
    completedGray,
    completedColor,
    rejectedColor,
    withIssues
} from './PurchaseOrderForm/statusIcons'

function OrderHistoryLayout() {
    function showPath() {
        return (
            <>
                <Flex mt={"-1px"} ml={"2em"} zIndex={1}>
                    {progressPath()}
                </Flex>
                <Flex mt={"-0.5em"} mb={"-1em"} ml={"2em"} zIndex={1}>
                    {progressPath()}
                </Flex>
            </>
        )
    }
  return (
    <Card variant={"outline"} >
        <CardHeader borderBottom={"1px ridge #d3d0cf"} py={1}>
            <Text fontSize={"xl"} fontWeight={"bold"}>Order History</Text>
        </CardHeader>

        <CardBody>
            <Flex gap={4} alignItems={"center"} zIndex={99}>
                {postedGray()}
                <Flex flexDir={"column"} lineHeight={"1.2em"}>
                    <Text fontWeight={"bold"}>Posted</Text>
                </Flex>
            </Flex>
            {showPath()}
            <Flex gap={4} alignItems={"center"}>
                {approvedGray()}
                <Flex flexDir={"column"} lineHeight={"1.2em"}>
                    <Text fontWeight={"bold"}>Approved</Text>
                </Flex>
            </Flex>
            {showPath()}
            <Flex gap={4} alignItems={"center"}>
                {purchasedGray()}
                <Flex flexDir={"column"} lineHeight={"1.2em"}>
                    <Text fontWeight={"bold"}>Purchased</Text>
                </Flex>
            </Flex>
            {showPath()}
            <Flex gap={4} alignItems={"center"}>
                {deliveredGray()}
                <Flex flexDir={"column"} lineHeight={"1.2em"}>
                    <Text fontWeight={"bold"}>Received</Text>
                </Flex>
            </Flex>
            {showPath()}
            <Flex gap={4} alignItems={"center"}>
                {completedGray()}
                <Flex flexDir={"column"} lineHeight={"1.2em"}>
                    <Text fontWeight={"bold"}>Completed</Text>
                </Flex>
            </Flex>
        </CardBody>
    </Card>
  )
}

export default OrderHistoryLayout

/* <Flex gap={4} alignItems={"center"}>
    {["Ongoing", "Purchased", "Delivered", "Completed"].findIndex(option => 
        option == data.statusID.name) != -1
        ? (ongoingColor()) : (ongoingGray())
    }
    <Flex flexDir={"column"} lineHeight={"1.2em"}>
        <Text fontWeight={"bold"}>Ongoing</Text>
        
        </Flex>
    </Flex> 
*/