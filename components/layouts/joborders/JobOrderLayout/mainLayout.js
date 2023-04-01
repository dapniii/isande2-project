import React from 'react'
import { 
    Flex, 
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Text,
    Grid,
    GridItem,
    Stack
} from '@chakra-ui/react'

function JobOrderMainLayout({user, initialData}) {
  return (
    <Flex flexDirection={"column"} p={3} gap={5}>
        {/* Job Description */}
        <Card variant={"outline"}>
            <CardHeader borderBottom={"1px ridge #d3d0cf"} py={1}>
                <Text fontSize={"xl"} fontWeight={"bold"}>Job Description</Text>
            </CardHeader>
            <CardBody>
                <Stack>
                    { initialData.details != null ? (
                        initialData.details.map((detail, index) => {
                            return (
                                <Text key={index}>{detail.jobID.name}</Text>
                            )
                        })
                    ) : (<></>)}
                </Stack>
            </CardBody>
        </Card>

        {/* Parts List */}
        <Card variant={"outline"}>
            <CardHeader borderBottom={"1px ridge #d3d0cf"} py={1}>
                <Text fontSize={"xl"} fontWeight={"bold"}>Parts List</Text>
            </CardHeader>
            <CardBody px={0}>
                <Grid
                    templateColumns={"0.5fr 2fr 3fr 2fr 3fr 2fr 2fr 2fr 1fr"}
                    autoFlow={"row"}
                    gap={2}
                >
                        {/* DETAILS HEADERS */}
                        <GridItem colStart={1} ><Text>{" "}</Text></GridItem>
                        <GridItem colStart={2}><Text fontWeight={"medium"}>Item Number</Text></GridItem>
                        <GridItem colStart={3}><Text fontWeight={"medium"}>Item</Text></GridItem>
                        <GridItem colStart={4}><Text fontWeight={"medium"}>Status</Text></GridItem>
                        <GridItem colStart={5}><Text fontWeight={"medium"}>Part Number</Text></GridItem>
                        <GridItem colStart={6}><Text fontWeight={"medium"}>Brand</Text></GridItem>
                        <GridItem colStart={7}><Text fontWeight={"medium"}>Requested Quantity</Text></GridItem>
                        <GridItem colStart={8}><Text fontWeight={"medium"}>Received Quantity</Text></GridItem>
                        <GridItem colSpan={8} mb={"2px"}><hr /></GridItem>
                        
                        { initialData.partsList != null ? (
                            initialData.partsList.map((row, index) => {
                                return (
                                    <>
                                        <GridItem colStart={1} m={"auto"} key={index}><Text fontWeight={"bold"}>{index+1}</Text></GridItem>
                                        <GridItem colStart={2} ><Text>{row.itemID.itemNumber}</Text></GridItem>
                                        <GridItem colStart={3} ><Text>{row.itemID.itemName + " " + row.itemID.itemModel}</Text></GridItem>
                                        <GridItem colStart={4} ><Text></Text></GridItem>
                                        <GridItem colStart={5}><Text>{row.detailID != null ? (row.detailID.partNumber) : (<></>)}</Text></GridItem>
                                        <GridItem colStart={6}><Text>{row.detailID != null ? (row.detailID.itemBrandID.name) : (<></>)}</Text></GridItem>
                                        <GridItem colStart={7}><Text fontSize={"lg"} fontWeight={"bold"}>{row.requestQty}</Text></GridItem>
                                        <GridItem colStart={8}><Text fontSize={"lg"} fontWeight={"bold"}>{row.returnQty}</Text></GridItem>
                                    </>
                                    
                                )
                            })
                        ) : (<></>)
                        }
                </Grid>
            </CardBody>
        </Card>

        {/* Return List */}
        <Card variant={"outline"}>
            <CardHeader borderBottom={"1px ridge #d3d0cf"} py={1}>
                <Text fontSize={"xl"} fontWeight={"bold"}>Return List</Text>
            </CardHeader>
            <CardBody px={0}>
                <Grid
                    templateColumns={"0.5fr 2fr 3fr 2fr 3fr 2fr 2fr 2fr"}
                    autoFlow={"row"}
                    gap={2}
                >
                        {/* DETAILS HEADERS */}
                        <GridItem colStart={1} ><Text>{" "}</Text></GridItem>
                        <GridItem colStart={2}><Text fontWeight={"medium"}>Item Number</Text></GridItem>
                        <GridItem colStart={3}><Text fontWeight={"medium"}>Item</Text></GridItem>
                        <GridItem colStart={4}><Text fontWeight={"medium"}>Status</Text></GridItem>
                        <GridItem colStart={5}><Text fontWeight={"medium"}>Part Number</Text></GridItem>
                        <GridItem colStart={6}><Text fontWeight={"medium"}>Brand</Text></GridItem>
                        <GridItem colStart={7}><Text fontWeight={"medium"}>Return Quantity</Text></GridItem>
                        <GridItem colSpan={8} mb={"1em"}><hr /></GridItem>

                        { initialData.partsList != null ? (
                            initialData.partsList.map((row, index) => {
                                if (row.returnQty > 0)
                                    return (
                                        <>
                                            <GridItem colStart={1} m={"auto"} key={index}><Text fontWeight={"bold"}>{index+1}</Text></GridItem>
                                            <GridItem colStart={2} ><Text>{row.itemID.itemNumber}</Text></GridItem>
                                            <GridItem colStart={3} ><Text>{row.itemID.itemName + " " + row.itemID.itemModel}</Text></GridItem>
                                            <GridItem colStart={4} ><Text></Text></GridItem>
                                            <GridItem colStart={5}><Text>{row.detailID != null ? (row.detailID.partNumber) : (<></>)}</Text></GridItem>
                                            <GridItem colStart={6}><Text>{row.detailID != null ? (row.detailID.itemBrandID.name) : (<></>)}</Text></GridItem>
                                            <GridItem colStart={7}><Text fontSize={"lg"} fontWeight={"bold"}>{row.returnQty}</Text></GridItem>
                                        </>  
                                    )
                            })
                        ) : (<></>)
                        }
                </Grid>
            </CardBody>
        </Card>
    </Flex>
  )
}

export default JobOrderMainLayout