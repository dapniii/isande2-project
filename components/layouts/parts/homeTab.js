import {
    Flex,
    Stat,
    StatLabel,
    StatNumber,
    StatGroup,
} from '@chakra-ui/react'
import { COLUMNS } from './partsColumns'
import BasicTable from '@/components/table/basicTable'
import GlobalFilter from '@/components/table/globalFilter'
import Dropdown from '@/components/table/dropdown'
import { Router, useRouter } from "next/router"
import { addCommasToNum } from '@/lib/dataHandler'

export default function PartsHomeTab({data}) {
    const router = useRouter();
    
    // Table Functions
    function getRowData(rowData) {
      let query = {
        id: rowData.itemNumber,
        name: rowData.itemName,
        model: rowData.itemModel
      }

      return query;
    }

    function navToDetails(query) {
      router.push({
        pathname: `/parts/${query.id}`,
        query: {
          itemName: query.name,
          itemModel: query.model,
        }
      })
    }

    function filters(filter, setFilter, globalFilter, setGlobalFilter) {
        return (
          <>
            <GlobalFilter
              filter={globalFilter}
              setFilter={setGlobalFilter} 
            ></GlobalFilter>
            <Dropdown 
              title="Categories"
              options={data.categories.itemCategories}
              id="categoryID"
              name="name"
              filter={filter}
              setFilter={setFilter}
            ></Dropdown>
            <Dropdown 
              title="Status"
              options={data.categories.status}
              id="status"
              name="name"
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
                    <StatNumber>P {addCommasToNum(data.partsData.totalValue)}</StatNumber>
                </Stat>

                <Stat>
                    <StatLabel>Low Stock</StatLabel>
                    <StatNumber>{data.partsData.count.lowStock}</StatNumber>
                </Stat>

                <Stat>
                    <StatLabel>Out of Stock</StatLabel>
                    <StatNumber>{data.partsData.count.outOfStock}</StatNumber>
                </Stat>
            </StatGroup>
            <BasicTable 
              COLUMNS={COLUMNS} 
              DATA={data.partsData.parts} 
              FILTERS={filters}
              HIDDEN={["itemNumber", "itemModel", "itemName", "status"]}
              getRowData={getRowData}
              clickRowFunction={navToDetails}
            />
        </Flex>
    )
}