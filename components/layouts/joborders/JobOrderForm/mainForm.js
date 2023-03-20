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

function CreateJobOrderForm({data}) {
    const [plateNumber, setPlateNumber] = useState("");
    const [mechanics, setMechanics] = useState([]);
    const [selectedJobs, setSelectedJobs] = useState([]);
    const [description, setDescription] = useState("");

    const [partsList, setPartsList] = useState([])
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
                                    {item.plateNumber}
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
                                        {item.userID.firstName + " " + item.userID.lastName}
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
                                {data.jobItems.map((item) => (
                                    <AutoCompleteItem
                                        key={item._id}
                                        value={item.jobID.name}
                                    >
                                        {item.jobID.name}
                                    </AutoCompleteItem>
                                ))}
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
        <CreateJobOrderPartsList />                              
    </Flex>
    )
}

export default CreateJobOrderForm