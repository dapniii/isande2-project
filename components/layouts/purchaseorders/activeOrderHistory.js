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

function ActiveOrderHistory({data}) {
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
                { 
                    data.statusID.name == null || 
                    ["Posted", "Approved", "Rejected", "Ongoing", "Purchased", "Received", "Delivered", "Completed", "With Issues"].findIndex(option => 
                        option == data.statusID.name) == -1     
                    ? (postedGray()) : (postedColor())
                }
                <Flex flexDir={"column"} lineHeight={"1.2em"}>
                    <Text fontWeight={"bold"}>Posted</Text>
                    { data.createdAt != null ? (<Text fontSize={"sm"}>{new Date(data.createdAt).toLocaleString()}</Text>) : (<></>) }
                    
                </Flex>
            </Flex>
            {showPath()}
            <Flex gap={4} alignItems={"center"}>
                {
                    data.statusID.name != "Rejected" ? (
                        ["Approved", "Ongoing", "Purchased", "Delivered", "Received", "Completed", "With Issues"].findIndex(option => 
                            option == data.statusID.name) != -1
                            ? (approvedColor()) : (approvedGray())
                        
                    ) : (rejectedColor())
                }

                <Flex flexDir={"column"} lineHeight={"1.2em"}>
                    <Text fontWeight={"bold"}>{data.statusID.name != "Rejected" ? ("Approved") : ("Rejected")}</Text>
                    { data.approval != null ? (<Text fontSize={"sm"}>{new Date(data.approval.createdAt).toLocaleString()}</Text>) : (<></>) }
                </Flex>
            </Flex>
            {showPath()}
            <Flex gap={4} alignItems={"center"}>
                {["Purchased", "Received", "Delivered", "Completed", "With Issues"].findIndex(option => 
                    option == data.statusID.name) != -1
                    ? (purchasedColor()) : (purchasedGray())
                }
                <Flex flexDir={"column"} lineHeight={"1.2em"}>
                    <Text fontWeight={"bold"}>Purchased</Text>
                    { data.purchasedDate != null ? (<Text fontSize={"sm"}>{new Date(data.purchasedDate).toLocaleString()}</Text>) : (<></>) }
                </Flex>
            </Flex>
            {showPath()}
            <Flex gap={4} alignItems={"center"}>
                {["Received", "Delivered", "Completed", "With Issues"].findIndex(option => 
                    option == data.statusID.name) != -1
                    ? (deliveredColor()) : (deliveredGray())
                }
                <Flex flexDir={"column"} lineHeight={"1.2em"}>
                    <Text fontWeight={"bold"}>Received</Text>
                    { data.deliveredDate != null ? (<Text fontSize={"sm"}>{new Date(data.deliveredDate).toLocaleString()}</Text>) : (<></>) }
                </Flex>
            </Flex>
            {showPath()}
            <Flex gap={4} alignItems={"center"}>
                {
                    data.statusID.name != "With Issues" ? (
                        ["Completed"].findIndex(option => 
                            option == data.statusID.name) != -1 
                            && data.statusID.name != "With Issues"
                            ? (completedColor()) : (completedGray())
                    ) : (withIssues())
                }

                <Flex flexDir={"column"} lineHeight={"1.2em"}>
                    <Text fontWeight={"bold"}>
                        {data.statusID.name != "With Issues" ? ("Completed") : ("With Issues")}
                    </Text>
                    { data.completedDate != null ? (<Text fontSize={"sm"}>{new Date(data.completedDate).toLocaleString()}</Text>) : (<></>) }
                </Flex>
            </Flex>
        </CardBody>
    </Card>
  )
}

export default ActiveOrderHistory

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