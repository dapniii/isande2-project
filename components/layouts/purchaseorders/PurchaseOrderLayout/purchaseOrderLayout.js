import { useState } from 'react'
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
import OrderHistoryLayout from '../orderHistory';
import EditablePurchaseOrderPartsList from './layoutPartsList';
import PurchaseOrderCommentSection from './commentSection';
import { purchaseOrderAPI } from '@/lib/routes';
import { generateID } from '@/lib/dataHandler';

function PurchaseOrderLayout({user, initialData}) {
    const [supplier, setSupplier] = useState(initialData.supplierID);
    const [requestedBy, setRequestedBy] = useState(initialData.requestedBy)
    const [description, setDescription] = useState("")
    const [partsList, setPartsList] = useState([])

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
                  <Input value={initialData.poNumber} disabled/>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Supplier</FormLabel>
                  <AutoComplete 
                      openOnFocus
                      focusInputOnSelect={false}
                      suggestWhenEmpty
                      restoreOnBlurIfEmpty={false} 
                      mx={2} 
                      value={supplier.name}
                      onChange={(value) => setSupplier(value)}
                  >
                      <AutoCompleteInput 
                        variant="outline"
                        value={supplier.name}
                        disabled
                        />
                      {/* <AutoCompleteList>
                          {options.suppliers.map((item) => (
                              <AutoCompleteItem
                                  key={item._id}
                                  value={item.name}
                              >
                                <Text>{item.name}</Text>  
                              </AutoCompleteItem>
                          ))}
                      </AutoCompleteList> */}
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
                      value={requestedBy.firstName + " " + requestedBy.lastName} 
                      onChange={(value) => setRequestedBy(value)}
                  >
                      <AutoCompleteInput 
                        variant="outline" 
                        value={requestedBy.firstName + " " + requestedBy.lastName}
                        disabled
                        />
                      <AutoCompleteList>
                          {/* {options.users.map((user) => (
                              <AutoCompleteItem
                                  key={user.userID}
                                  value={user.firstName + " " + user.lastName}
                              >
                                  <Flex flexDirection={"column"}>
                                      <Text>{user.firstName + " " + user.lastName}</Text>
                                  </Flex>      
                              </AutoCompleteItem>
                          ))} */}
                      </AutoCompleteList>
                  </AutoComplete>
                </FormControl>
              </Flex>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea 
                  h={"87%"} 
                  value={initialData.description}
                  disabled
                //   onChange={(e) => setDescription(e.target.value)}
                />
              </FormControl>
            </CardBody>
          </Card>
          <EditablePurchaseOrderPartsList partsList={initialData.partsList} />
          <PurchaseOrderCommentSection user={user} data={initialData.comments} />
        </Flex>
  
        {/* Order History */}
        <Flex flexDir={"column"} w={"30%"} gap={3}>
          <OrderHistoryLayout data={initialData} />
        </Flex>
        
      </Flex>
    )
}

export default PurchaseOrderLayout