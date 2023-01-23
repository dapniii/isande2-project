import { useState } from "react";
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

    return (
        <>
            <Select
                w={"25%"}
                value={filter} 
                name={id}
                onChange={(e) => setFilter(e.target.name, e.target.value || "")}
                border={"1px solid #9F9F9F"}
            >
                {/* TEMPORARY HARDCODE */}
                <option value="" key="00000" defaultValue>
                    All {title}
                </option>

                <option key="Low Stock" value="Low Stock">
                    Low Stock
                </option>
                <option key="Under Chassis" value="Under Chassis">
                    Under Chassis
                </option>
                <option key="Electrical" value="Electrical">
                    Electrical
                </option>
                {/* {options.map((option) => (
                    <option key={option[id]} value={option[name]}>
                        {option[name]}
                    </option>
                ))} */}
            </Select>
        </>
    )
}

export default Dropdown;