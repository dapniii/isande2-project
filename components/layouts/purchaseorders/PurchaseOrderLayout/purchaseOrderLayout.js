import { useEffect, useState } from 'react'
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
import ActiveOrderHistory from '../activeOrderHistory';
import PurchaseOrderDetailedPartsList from './detailedPartsList';
import PurchaseOrderCompletePartsList from './completePartsList';
import PurchaseOrderCommentSection from './commentSection';
import PurchaseOrderFileSection from './fileSection';
import { uploadPoFile } from '@/lib/images/imageHandler';
import { purchaseOrderAPI } from '@/lib/routes';
import { generateID } from '@/lib/dataHandler';


function PurchaseOrderLayout({
  user, 
  initialData, 
  categoryList, 
  approveFunc,
  confirmPurchaseFunc
}) {
    const [supplier, setSupplier] = useState(initialData.supplierID);
    const [requestedBy, setRequestedBy] = useState(initialData.requestedBy)
    const [description, setDescription] = useState("")
    const [partsList, setPartsList] = useState([])
    const [files, setFiles] = useState([])



    async function approve() {
      let poData = {
          poID: initialData._id,
          approverID: user.userID,
          approvedDate: new Date(),
      }
  
      await fetch(purchaseOrderAPI.approve, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(poData),
      }).then(result => result.json())
      .then(data => {
          console.log(data)
          if (data.error != null) 
              console.log(data.error)
          location.reload()
      })
    }

    function passApproveFunc() {
      return approve
    }

    useEffect(() => {
      approveFunc(passApproveFunc)
    }, [partsList])

    async function confirmPurchase() {
      let uploadConfig = {
        poNumber: initialData.poNumber,
      }
      let fileRes = await Promise.all(files.map(file => uploadPoFile(file, uploadConfig)))
  
      console.log(fileRes)
      let bodyData = {
        poID: initialData._id,
        poNumber: initialData.poNumber,
        purchasedDate: new Date(),
        purchasedBy: user.userID,
        uploadedFiles: fileRes,
        detailedParts: partsList,
      }
      
      await fetch(purchaseOrderAPI.confirm_purchase, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyData),
      })
      .then(result => result.json())
      .then(data => {
          console.log(data)
          if (data.error != null) 
              console.log(data.error)
          location.reload()
      })

    }

    function passConfirmPurchaseFunc() {
      return confirmPurchase
    }

    useEffect(() => {
      confirmPurchaseFunc(passConfirmPurchaseFunc)
    }, [files, partsList])

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

          {/* 
              Form to specify the details of the items to be purchased 
              User must have a purchasing role
          */}
          { 
            ["Posted", "Rejected", "Approved"].findIndex(option => option == initialData.statusID.name) != -1 
            ? (<PurchaseOrderDetailedPartsList user={user} initialData={initialData} options={categoryList} setSubmitArray={setPartsList} />) 
            : (<></>)
          }

          {/* 
              Completed parts list after PO has been approved
          */}
          { 
            ["Purchased", "Received", "Completed", "With Issues"].findIndex(option => option == initialData.statusID.name) != -1
            ? (<PurchaseOrderCompletePartsList partsList={initialData.partsList} />) 
            : (<></>)
          }

          <PurchaseOrderCommentSection user={user} poNumber={initialData.poNumber} data={initialData.comments} />
        </Flex>
  
        {/* Order History */}
        <Flex flexDir={"column"} w={"30%"} gap={3}>
          <ActiveOrderHistory data={initialData} />
          <PurchaseOrderFileSection data={initialData} setSubmitArray={setFiles} />
        </Flex>
        
      </Flex>
    )
}

export default PurchaseOrderLayout