import { useState, useEffect, useRef } from "react"
import {
    Card,
    CardHeader,
    CardBody,
    Flex,
    Text,
    Input,
    Stack,
    Link,
    Icon,
    IconButton
} from "@chakra-ui/react";
import { AddFileButton } from "@/components/buttons";
import { MdCancel, MdFilePresent } from "react-icons/md";

function PurchaseOrderFileSection({data, setSubmitArray}) {
    const [files, setFiles] = useState([])
    const [indexToEdit, setIndexToEdit] = useState(-1)
    const inputFile = useRef(null)

    useEffect(() => {
        setSubmitArray(files)
    }, [files])

    function handleFileSelect(e, index) {
        let convertedFiles = Array.prototype.slice.call(e.target.files)
        let stored = [...files]
        convertedFiles.some(file => {
            if (stored.findIndex(f => f.name == file.name) -1) {
                if (indexToEdit == -1) stored.push(file)
                else stored[indexToEdit] = file
            }
            
        })

        setIndexToEdit(-1)
        setFiles(stored)
    }

    function handleFileClick(index) {
        setIndexToEdit(index)
        inputFile.current.click()
    }

    function handleDeleteFile(selectIndex) {
        let newFiles = files.filter((f, index) => index != selectIndex)
        setFiles(newFiles)
        inputFile.current.value = ""
    }

    return (
        <Card variant={"outline"}>
            <CardHeader 
                display={"flex"}
                justifyContent={"space-between"}
                borderBottom={"1px ridge #d3d0cf"} 
                py={3}
            >
                <Text fontSize={"xl"} fontWeight={"bold"}>Files</Text>
                {
                    ["Approved"].findIndex(option => option == data.statusID.name) != -1 
                        ? 
                        (
                            <>
                                <AddFileButton title={"Add File"} clickFunction={() => inputFile.current.click()}/>
                                <Input 
                                    type={"file"}
                                    display={"none"}
                                    multiple
                                    onChange={(e) => handleFileSelect(e)}
                                    ref={inputFile}
                                />
                            </>
                            
                        ) : (<></>)
                }
                
            </CardHeader>
            <CardBody>
                <Stack gap={3}>
                    {
                        files.length > 0 ? (
                            files.map((file, index) => {
                                return (
                                    <Flex justifyContent={"space-between"}>
                                        <Flex 
                                            gap={2} 
                                            alignItems={"center"}
                                            _hover={{                                               
                                                cursor: "pointer",
                                                textDecoration: "underline"
                                            }} 
                                        >
                                            <Icon as={MdFilePresent} boxSize={6} />
                                            {
                                                ["Approved"].findIndex(option => option == data.statusID.name) != -1 
                                                ? (<Text onClick={() => handleFileClick(index)}>{file.name}</Text>)
                                                : (<Text>{file.name}</Text>)
                                            }
                                            
                                        </Flex>
                                        {
                                            ["Approved"].findIndex(option => option == data.statusID.name) != -1 
                                            ? 
                                            ( 
                                                <IconButton
                                                    variant='outline'
                                                    size={"sm"}
                                                    colorScheme='gray'
                                                    aria-label='Delete Row'
                                                    icon={<MdCancel />}
                                                    onClick={() => handleDeleteFile(index)}
                                                /> 
                                            )
                                            : (<></>)
                                        }

                                    </Flex>
                                )
                            })

                        ) : (<></>)
                    }
                </Stack>
            </CardBody>
        </Card>
    )
}

export default PurchaseOrderFileSection