import * as React from "react";
import { Button, Icon } from "@chakra-ui/react";
import { MdAddCircle, MdCheckCircle, MdCancel, MdEdit } from "react-icons/md";

export function AddButton({title, clickFunction}) {
    return (
        <Button
            bg={"green.400"}
            color={"white"}
            px={"1em"}
            size={"sm"}
            borderRadius={"0.4em"}
            leftIcon={<Icon as={MdAddCircle} boxSize={"1.3em"} />}
            onClick={() => clickFunction()}
        >
            {title}
        </Button>
    )
}

export function SaveButton({title, clickFunction}) {
    return (
        <Button
            bg={"green.400"}
            color={"white"}
            px={"0.7em"}
            size={"sm"}
            borderRadius={"0.4em"}
            leftIcon={<Icon as={MdCheckCircle} boxSize={"1.3em"} />}
            onClick={() => clickFunction()}
        >
            {title}
        </Button>
    )
}

export function CancelButton({title, clickFunction}) {
    return (
        <Button
            bg={"blackAlpha.500"}
            color={"white"}
            px={"1em"}
            size={"sm"}
            borderRadius={"0.4em"}
            leftIcon={<Icon as={MdCancel} boxSize={"1.3em"} />}
            onClick={() => clickFunction()}
        >
            {title}
        </Button>
    )
}

export function EditButton({title, clickFunction}) {
    return (
        <Button
            bg={"blue.600"}
            color={"white"}
            px={"1em"}
            size={"sm"}
            borderRadius={"0.4em"}
            leftIcon={<Icon as={MdEdit} boxSize={"1.3em"} />}
            onClick={() => clickFunction()}
        >
            {title}
        </Button>
    )
}

