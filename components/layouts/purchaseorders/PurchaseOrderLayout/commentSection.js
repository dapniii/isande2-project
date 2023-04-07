import { useState, useEffect, useReducer } from "react"
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Text,
    Textarea,
    Stack
} from "@chakra-ui/react"
import { AddCommentButton } from "@/components/buttons";
import { formatDistance } from 'date-fns'

function PurchaseOrderCommentSection({user, data}) {
    const [editState, setEditState] = useState(false)
    const [commentList, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case "add": {// add new item at end of array 
                return [...state, action.payload]
            }
            default: 
                return data
        }

    })
    const [comment, setComment] = useState("")

    useEffect(() => {
        if (commentList == null) {
            dispatch({type: "default"})
        }

    },[data])

    function handleCommentClick() {
        if (editState) {
            dispatch({type: "add", payload: {
                userID: user.userID,
                user: user.firstName + " " + user.lastName,
                commentText: comment,
                commentDate: new Date()
            }})
            setComment("")
            setEditState(false)
        }

        else {
            setEditState(true)
        }
    }

    return (
        <Card variant={"outline"}>
            <CardHeader 
                display={"flex"}
                justifyContent={"space-between"}
                borderBottom={"1px ridge #d3d0cf"} 
                py={3}
            >
                <Text fontSize={"xl"} fontWeight={"bold"}>Comments</Text>
                <AddCommentButton title={"Comment"} clickFunction={() => handleCommentClick()}/>
            </CardHeader>
            <CardBody maxH={"13em"} overflowY={"auto"}>
                <Stack>
                    {
                        editState ? (
                            <Textarea 
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder={"Enter comment here"}
                            />
                        ) : (<></>)
                    }
                    {   commentList != null ? (
                            commentList.map(comment => {
                                return (
                                
                                    <Card variant={"elevated"} size={"sm"}>
                                        <CardHeader display={"flex"} justifyContent={"space-between"}>
                                            <Text fontWeight={"bold"}>{comment.user}</Text>
                                            <Text>
                                                {
                                                    formatDistance(comment.commentDate, new Date(), 
                                                    { addSuffix: true })
                                                }
                                            </Text>
                                        </CardHeader>
                                        <CardBody>
                                            <Text>{comment.commentText}</Text>
                                        </CardBody>
                                        
                                    </Card>
                                        
                                
                                )
                            })
                        ) : (<></>) 

                    }
                </Stack>
            </CardBody>
        </Card>
    )
}

export default PurchaseOrderCommentSection