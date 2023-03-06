import {
    Flex,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    StatGroup,
} from '@chakra-ui/react'
import { COLUMNS } from './partsColumns'
import BasicTable from '@/components/table/basicTable'
import GlobalFilter from '@/components/table/globalFilter'
import Dropdown from '@/components/table/dropdown'

export default function PartsHomeTab({data}) {

    function filters(filter, setFilter, globalFilter, setGlobalFilter) {
        return (
          <>
            <GlobalFilter
              filter={globalFilter}
              setFilter={setGlobalFilter} 
            ></GlobalFilter>
            <Dropdown 
              title="Categories"
              id="categoryID"
              name="category"
              filter={filter}
              setFilter={setFilter}
            ></Dropdown>
            <Dropdown 
              title="Status"
              id="status"
              name="status"
              filter={filter}
              setFilter={setFilter}
            ></Dropdown>
          </>
        )
    }

    return (
        <Flex flexDirection={"column"} gap={5}>
            <StatGroup bg={"white"} p={5} boxShadow={"xl"} borderRadius={5}>
                <Stat>
                    <StatLabel>Total Inventory Value</StatLabel>
                    <StatNumber>P 345,670</StatNumber>
                    <StatHelpText>
                    <StatArrow type='increase' />
                    23.36%
                    </StatHelpText>
                </Stat>

                <Stat>
                    <StatLabel>Low Stock</StatLabel>
                    <StatNumber>45</StatNumber>
                    <StatHelpText>
                    <StatArrow type='decrease' />
                    9.05%
                    </StatHelpText>
                </Stat>

                <Stat>
                    <StatLabel>Out of Stock</StatLabel>
                    <StatNumber>45</StatNumber>
                    <StatHelpText>
                    <StatArrow type='decrease' />
                    9.05%
                    </StatHelpText>
                </Stat>
            </StatGroup>
            {/* <BasicTable 
              COLUMNS={COLUMNS} 
              DATA={data} 
              FILTERS={filters}
              HIDDEN={["code", "model", "name", "status"]}
            /> */}
        </Flex>
    )
}