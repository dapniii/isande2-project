import { useState } from 'react';
import { InputGroup, Input, InputRightElement, Icon } from '@chakra-ui/react';
import { MdSearch } from 'react-icons/md';

export const GlobalFilter = ({filter, setFilter}) => {
    const [value, setValue] = useState(filter);

    return (
        <InputGroup maxW={"30%"}>
            <Input
                placeholder="Search"
                variant="outline"
                value = {filter || ""}
                border={"1px solid #9F9F9F"}
                onChange={(e) => {setFilter(e.target.value)}}
            />
            <InputRightElement children={<Icon as={MdSearch} color='gray.500' boxSize={5} />} />
        </InputGroup>   
    )
}
export default GlobalFilter;