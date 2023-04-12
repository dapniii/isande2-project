import React from 'react'
import { 
    Tabs,
    Tab,
    TabList,
    TabPanels,
    TabPanel 
} from '@chakra-ui/react'
import BasicTable from '@/components/table/basicTable'
import GlobalFilter from '@/components/table/globalFilter'
import Dropdown from '@/components/table/dropdown'
import { COLUMNS } from "./serviceHistoryColumns"

function VehicleServiceHistoryTab({data}) {

    function filters(filter, setFilter, globalFilter, setGlobalFilter) {
        return (
          <>
            {/* <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
            <Dropdown
              title="Status"
              options={data.categories.status}
              id="status"
              name="name"
              filter={filter}
              setFilter={setFilter}
            />
            <Dropdown
              title="Vehicle Type"
              options={data.categories.vehicleTypes}
              id="vehicleType"
              name="name"
              filter={filter}
              setFilter={setFilter}
            />
            <Dropdown
              title="Transmission"
              options={data.categories.transmission}
              id="transmission"
              name="name"
              filter={filter}
              setFilter={setFilter}
            /> */}
          </>
        );
      }

  return (
    <>
        <BasicTable 
            COLUMNS={COLUMNS}
            DATA={data}
            FILTERS={filters}
            HIDDEN={[]}
        />
    </>
  )
}

export default VehicleServiceHistoryTab