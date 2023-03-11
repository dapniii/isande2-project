import { 
    Grid,
    GridItem,
    Flex,
    Text
} from "@chakra-ui/react"
import { EditButton } from "@/components/buttons"

function createIdRow(title, value) {
    return(
        <Flex w={"100%"}>
            <Flex border={"1px ridge #BBBBBB"} w={"50%"} justifyContent={"end"} px={"3"} py={"2"}>
                <Text fontWeight={"bold"}>{title}</Text>
            </Flex>
            <Flex border={"1px ridge #BBBBBB"} w={"50%"} px={"3"} py={"2"}>
                <Text>{value}</Text>
            </Flex>
        </Flex>
    )
}

function createDetailRow(index, detail) {
    return(
        <>
            <GridItem colStart={1} m={"auto"}><Text fontWeight={"bold"}>{index+1}</Text></GridItem>
            <GridItem colStart={2}><Text>{detail.partNumber}</Text></GridItem>
            <GridItem colStart={3}><Text>{detail.itemBrandID.name}</Text></GridItem>
            <GridItem colStart={4}><Text>Php {parseFloat(detail.unitPrice.$numberDecimal).toLocaleString()}</Text></GridItem>
            <GridItem colStart={5}><Text>{detail.quantity}</Text></GridItem>
        </>
    )
}

function ViewPartLayout({data}) {
  return (
    <Flex flexDirection={"column"} gap={5}>
        <Flex bg={"white"} boxShadow={"lg"} borderRadius={3} flexDirection={"column"}>
            <Text m={"0.5em"} mb={0} fontSize={"xl"} fontWeight={"bold"}>Identification</Text>
            <hr />
            {createIdRow("Item Number", data.itemNumber)}
            {createIdRow("Unit of Measurement", data.unit)}
            {createIdRow("Description", data.desc)}
            {createIdRow("Reorder Point", data.rp)}
            {createIdRow("EOQ", data.eoq)}
        </Flex>
        <Flex bg={"white"} boxShadow={"lg"} borderRadius={3} flexDirection={"column"}>
            <Flex alignItems={"center"} py={3}>
                <Text my={"auto"} mx={5} fontSize={"xl"} fontWeight={"bold"}>Details</Text>
                <EditButton title={"Adjust"} />
            </Flex>
            <hr />
            <Grid
                mt={"6px"}
                w={"100%"}
                templateColumns={"1fr 3fr 2fr 7fr 2fr"}
                autoFlow={"row"}
                gap={2}
                pb={3}
            >
                    {/* DETAILS HEADERS */}
                    <GridItem colStart={1}><Text>{" "}</Text></GridItem>
                    <GridItem colStart={2}><Text fontWeight={"medium"}>Part Number</Text></GridItem>
                    <GridItem colStart={3}><Text fontWeight={"medium"}>Brand</Text></GridItem>
                    <GridItem colStart={4}><Text fontWeight={"medium"}>Unit Price</Text></GridItem>
                    <GridItem colStart={5}><Text fontWeight={"medium"}>Quantity</Text></GridItem>
                    <GridItem colSpan={5} mb={"0.5em"}><hr /></GridItem>
                    {
                        data.detailsArray.map((detail, index) => {
                            return (<>{createDetailRow(index, detail)}</>)
                            
                        })
                    }
                    <GridItem colStart={4} textAlign={"right"} my={"auto"} pr={"7"}>
                        <Text fontWeight={"bold"}>Total</Text>
                    </GridItem>
                    <GridItem colStart={5} display={"flex"} gap={1}>
                        <Text fontSize={"xl"} fontWeight={"bold"}>{data.quantity}</Text>
                        <Text fontSize={"sm"} color={"gray"} alignSelf={"end"} mb={"3px"}>{data.unit}</Text>
                    </GridItem>
            </Grid>


        </Flex>
    </Flex>
  )
}

export default ViewPartLayout;