import { useState, useEffect } from 'react'
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
import { purchaseOrderAPI } from '@/lib/routes';
import { generateID } from '@/lib/dataHandler';

function CreatePurchaseOrderForm({options, creatorID, submitFunc}) {
  const poNumber = generateID(options.poCount, 10)
  const [supplier, setSupplier] = useState("");
  const [requestedBy, setRequestedBy] = useState("")
  const [description, setDescription] = useState("")
  const [partsList, setPartsList] = useState([])

  function passSubmitFunc() {
    return submitForm
  }
    // TODO: Convert to UseContext (basta prevent it from re-rendering all the time huhu)
    useEffect(() => {
      submitFunc(passSubmitFunc)
    }, [supplier, requestedBy, description, partsList])

  async function submitForm() {
    let poData = {
        poNumber: poNumber,
        statusID: "Posted",
        supplierID: supplier,
        requestedBy: requestedBy,
        description: description,
        creatorID: creatorID,
        partsList: partsList,
    }
    await fetch(purchaseOrderAPI.create_purchase_order, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(poData),
    }).then(result => result.json())
    .then(data => {
        if (data.error != null) 
            console.log(data.error)
        location.reload()
    })

}
  
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
                    onChange={(value) => setSupplier(value)}
                >
                    <AutoCompleteInput variant="outline" />
                    <AutoCompleteList>
                        {options.suppliers.map((item) => (
                            <AutoCompleteItem
                                key={item._id}
                                value={item.name}
                            >
                              <Text>{item.name}</Text>  
                            </AutoCompleteItem>
                        ))}
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
                    onChange={(value) => setRequestedBy(value)}
                >
                    <AutoCompleteInput variant="outline" />
                    <AutoCompleteList>
                        {options.users.map((user) => (
                            <AutoCompleteItem
                                key={user.userID}
                                value={user.firstName + " " + user.lastName}
                            >
                                <Flex flexDirection={"column"}>
                                    <Text>{user.firstName + " " + user.lastName}</Text>
                                </Flex>      
                            </AutoCompleteItem>
                        ))}
                    </AutoCompleteList>
                </AutoComplete>
              </FormControl>
            </Flex>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea 
                h={"87%"} 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
          </CardBody>
        </Card>
        <PurchaseOrderPartsList options={options} setSubmitArray={setPartsList} />
      </Flex>

      {/* Order History */}
      <Flex flexDir={"column"} w={"30%"} gap={3}>
        <OrderHistoryLayout />
      </Flex>
      
    </Flex>
  )
}

export default CreatePurchaseOrderForm