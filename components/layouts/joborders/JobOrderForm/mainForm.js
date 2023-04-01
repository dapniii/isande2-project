import { useState, useRef, useEffect } from "react";
import {
    Text, 
    Flex,
    Stack,
    Card, 
    CardBody, 
    CardHeader,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Textarea,
    Box, 
    Image,
} from "@chakra-ui/react";
import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
    AutoCompleteGroup,
    AutoCompleteGroupTitle,
    AutoCompleteTag,
    AutoCompleteCreatable
} from "@choc-ui/chakra-autocomplete";
import CategoryListModal from "@/components/basicCategoryModal";
import CreateJobOrderPartsList from "./partsList";

function CreateJobOrderForm({user, JONumber, data, submitFunc}) {
    const [plateNumber, setPlateNumber] = useState("");
    const [mechanics, setMechanics] = useState([]);
    const [selectedJobs, setSelectedJobs] = useState([]);
    const [description, setDescription] = useState("");
    const [partsList, setPartsList] = useState([])


    function passSubmitFunc() {
        return submitForm
    }

    // TODO: Convert to UseContext (basta prevent it from re-rendering all the time huhu)
    useEffect(() => {
        submitFunc(passSubmitFunc)
    }, [plateNumber, mechanics, selectedJobs, description, partsList])

    async function submitForm() {
        let jobOrderData = {
            jobOrderID: JONumber,
            vehicleID: plateNumber,
            statusID: "Open",
            mechanics: mechanics,
            description: description,
            creatorID: user.userID,
            selectedJobs: selectedJobs,
            partsList: partsList,
        }
        await fetch("/api/joborders/createNewJobOrder", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(jobOrderData),
        }).then(result => result.json())
        .then(data => {
            if (data.error != null) 
                console.log(data.error)
            location.reload()
        })

    }


    return (
        <Flex flexDirection={"column"} gap={3}> 
            {/* Top part of the form */}
            <Flex justifyContent={"space-between"} gap={2}>
            {/* Job Details */}
            <Card variant={"outline"} w={"30%"}>
                <CardHeader borderBottom={"1px ridge #d3d0cf"} py={1}>
                    <Text fontSize={"xl"} fontWeight={"bold"}>Job Details</Text>
                </CardHeader>
                <CardBody>
                    <Stack>
                        <FormControl isRequired>
                            <FormLabel>Plate Number</FormLabel>
                            <AutoComplete openOnFocus suggestWhenEmpty value={plateNumber} onChange={(value) => setPlateNumber(value)}>
                                <AutoCompleteInput variant="outline" />
                                <AutoCompleteList w={"100%"}>
                                {data.vehicles.map((item) => (
                                    <AutoCompleteItem
                                        key={item.plateNumber}
                                        value={item.plateNumber}
                                    >
                                        <Flex gap={5}>
                                            <Image 
                                                src={item.imageID.secure_url}
                                                alt={item.plateNumber}
                                                objectFit={"cover"}
                                                borderRadius={"15"}
                                                w={"5em"}
                                            /> 
                                            <Flex flexDirection={"column"}>
                                                <Text fontWeight={"bold"}>{item.plateNumber}</Text>
                                                <Text>{item.brandID.name} {item.vehicleTypeID.name}</Text>
                                            </Flex>
                                        </Flex>
                                    </AutoCompleteItem>
                                ))}
                                </AutoCompleteList>
                            </AutoComplete>
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Assigned Mechanics</FormLabel>
                            <AutoComplete 
                                openOnFocus 
                                multiple
                                restoreOnBlurIfEmpty={false} 
                                onChange={vals => setMechanics(vals)}>
                                <AutoCompleteInput variant="outline">
                                    {({ tags }) =>
                                            tags.map((tag, tid) => (
                                                <AutoCompleteTag
                                                key={tid}
                                                label={tag.label}
                                                onRemove={tag.onRemove}
                                                />
                                        ))
                                    }
                                </ AutoCompleteInput>
                                <AutoCompleteList w={"100%"}>
                                    {data.mechanics.map((item) => (
                                        <AutoCompleteItem
                                            key={item._id}
                                            value={item.userID.firstName + " " + item.userID.lastName}
                                        >
                                            <Flex gap={5}>
                                                <Image 
                                                    src={item.userID.imageID.secure_url}
                                                    alt={item.userID.firstName + " " + item.userID.lastName}
                                                    objectFit={"cover"}
                                                    borderRadius={"15"}
                                                    w={"3em"}
                                                    h={"3em"}
                                                /> 
                                                <Flex flexDirection={"column"}>
                                                    <Text fontWeight={"bold"}>{item.userID.firstName} {item.userID.lastName}</Text>
                                                    <Text>{item.specialtyID.name}</Text>
                                                </Flex>
                                            </Flex>
                                        </AutoCompleteItem>
                                    ))}
                                </AutoCompleteList>
                            </AutoComplete>
                            </FormControl>
                        </Stack>
                    </CardBody>
                </Card>
                {/* Job Description */}
                <Card variant={"outline"} w={"70%"}>
                    <CardHeader borderBottom={"1px ridge #d3d0cf"} py={1}>
                        <Text fontSize={"xl"} fontWeight={"bold"}>Job Description</Text>
                    </CardHeader>
                    <CardBody display={"flex"} gap={2}>
                        <FormControl isRequired >
                            <FormLabel>Job List</FormLabel>
                            <AutoComplete 
                                openOnFocus 
                                multiple
                                restoreOnBlurIfEmpty={false}  
                                onChange={vals => setSelectedJobs(vals)}>
                                <AutoCompleteInput variant="outline" hidePlaceholder>
                                    {({ tags }) =>
                                        tags.map((tag, tid) => (
                                            <AutoCompleteTag
                                            key={tid}
                                            label={tag.label}
                                            onRemove={tag.onRemove}
                                            />
                                        ))
                                    }
                                </ AutoCompleteInput>
                                <AutoCompleteList w={"100%"}>
                                    {[... new Set(data.jobItems.map(data => data.jobID.name))].map((item) => (
                                        <AutoCompleteItem
                                            key={item}
                                            value={item}
                                        >
                                             {item}
                                        </AutoCompleteItem>
                                    ))}
                                    <AutoCompleteItem
                                        key={"custom"}
                                        value={"custom"}
                                        fontWeight={"bold"}
                                        fixed
                                    >
                                        Custom
                                    </AutoCompleteItem>
                                </AutoCompleteList>
                            </AutoComplete>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Other</FormLabel>
                            <Textarea />
                        </FormControl>

                    </CardBody>
                </Card>
            </Flex>
            <CreateJobOrderPartsList 
                options={data} 
                selectedJobs={selectedJobs} 
                setSubmitArray={setPartsList} 
            />                              
        </Flex>
    )
}

export default CreateJobOrderForm