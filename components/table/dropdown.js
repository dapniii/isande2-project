import { useState, useEffect } from "react";
import { Select } from "@chakra-ui/react";

export const Dropdown = ({
    options, 
    title, 
    id, 
    name,
    filter, 
    setFilter,
    }) => {

    const [value, setValue] = useState(filter)

    useEffect(() => {
        console.log(options)
    }, [])

    return (
        <>
            <Select
                w={"25%"}
                value={filter} 
                name={id}
                onChange={(e) => setFilter(e.target.name, e.target.value || "")}
                border={"1px solid #9F9F9F"}
            >
                <option key="00000" value="" defaultValue>All {title}</option>
                {options.map((option) => (
                    <option key={option[name]} value={option[name]}>
                        {option[name]}
                    </option>
                ))}
            </Select>
        </>
    )
}

export default Dropdown;