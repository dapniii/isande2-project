import React from 'react'
import { 
  Flex ,
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { 
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteList,
  AutoCompleteItem
} from "@choc-ui/chakra-autocomplete";
import OrderHistoryLayout from './orderHistory';
import PurchaseOrderPartsList from './partsList';

function CreatePurchaseOrderForm() {
  // Temp values
  const poNumber = "1000000001"
  const tempStatus = "Draft"

  return (
    <Flex p={5} gap={5}>
        {/* Order Details */}
        <Flex flexDir={"column"} w={"70%"} gap={3}>
        <Card variant={"outline"} >
          <CardHeader borderBottom={"1px ridge #d3d0cf"} py={1}>
              <Text fontSize={"xl"} fontWeight={"bold"}>Order Details</Text>
          </CardHeader>
          <CardBody display={"flex"} gap={7}>
            <Flex flexDirection={"column"} w={"45%"} gap={3}>
              <FormControl>
                <FormLabel>PO Number</FormLabel>
                <Input value={poNumber} disabled/>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Supplier</FormLabel>
                <AutoComplete 
                    openOnFocus
                    focusInputOnSelect={false}
                    suggestWhenEmpty
                    restoreOnBlurIfEmpty={false} 
                    mx={2} 
                    // onChange={(value) => handleItemSelect(value)}
                >
                    <AutoCompleteInput variant="outline" />
                    <AutoCompleteList>
                        {/* {options.partItems.map((item) => (
                            <AutoCompleteItem
                                key={item.itemNumber}
                                value={item.itemNumber}
                            >
                                <Flex flexDirection={"column"}>
                                    <Text fontWeight={"bold"}>{item.itemNumber}</Text>
                                    <Text fontSize={"sm"}>{item.itemName} {item.itemModel}</Text>
                                </Flex>
                                
                            </AutoCompleteItem>
                        ))} */}
                    </AutoCompleteList>
                </AutoComplete>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Requested By</FormLabel>    
                <AutoComplete 
                    openOnFocus
                    focusInputOnSelect={false}
                    suggestWhenEmpty
                    restoreOnBlurIfEmpty={false} 
                    mx={2} 
                    // onChange={(value) => handleItemSelect(value)}
                >
                    <AutoCompleteInput variant="outline" />
                    <AutoCompleteList>
                        {/* {options.partItems.map((item) => (
                            <AutoCompleteItem
                                key={item.itemNumber}
                                value={item.itemNumber}
                            >
                                <Flex flexDirection={"column"}>
                                    <Text fontWeight={"bold"}>{item.itemNumber}</Text>
                                    <Text fontSize={"sm"}>{item.itemName} {item.itemModel}</Text>
                                </Flex>
                                
                            </AutoCompleteItem>
                        ))} */}
                    </AutoCompleteList>
                </AutoComplete>
              </FormControl>
            </Flex>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea h={"87%"} />
            </FormControl>
          </CardBody>
        </Card>
        <PurchaseOrderPartsList />
      </Flex>

      {/* Order History */}
      <Flex flexDir={"column"} w={"30%"} gap={3}>
        <OrderHistoryLayout status={tempStatus} />
      </Flex>
      
    </Flex>
  )
}

export default CreatePurchaseOrderForm