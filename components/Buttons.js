import * as React from "react";
import { Button, Icon } from "@chakra-ui/react";
import { MdAddCircle, MdCheckCircle, MdCancel, MdEdit, MdKeyboardArrowLeft } from "react-icons/md";

export function AddButton({title, clickFunction}) {
    return (
        <Button
            bg={"green.400"}
            color={"white"}
            px={"0.7em"}
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
            px={"0.7em"}
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
            bg={"#005DF2"}
            color={"white"}
            px={"0.7em"}
            size={"sm"}
            borderRadius={"0.4em"}
            leftIcon={<Icon as={MdEdit} boxSize={"1.3em"} />}
            onClick={() => clickFunction()}
        >
            {title}
        </Button>
    )
}

export function BackButton({title, clickFunction}) {
    return (
        <Button
            bg={"white"}
            color={"black"}
            px={"0.7em"}
            size={"md"}
            borderRadius={"0.4em"}
            leftIcon={<Icon as={MdKeyboardArrowLeft} boxSize={"1.8em"} />}
            onClick={() => clickFunction()}
            fontWeight={"bold"}
        >
            {title}
        </Button>
    )
}

