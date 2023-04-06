import React from 'react'
import { 
    Flex,
    Text,
    Card,
    CardHeader,
    CardBody,
    Stack,
} from '@chakra-ui/react'
import { COLUMNS } from './poColumns'
import BasicTable from '@/components/table/basicTable'
import GlobalFilter from '@/components/table/globalFilter'
import Dropdown from '@/components/table/dropdown'

function PurchaseOrderHomeTab({poData, categoryList}) {

    function filters(filter, setFilter, globalFilter, setGlobalFilter) {
        return (
          <>
            <GlobalFilter
              filter={globalFilter}
              setFilter={setGlobalFilter} 
            ></GlobalFilter>
            <Dropdown 
              title="Supplier"
              options={categoryList.suppliers}
              id="supplier"
              name="name"
              filter={filter}
              setFilter={setFilter}
            ></Dropdown>
              <Dropdown 
              title="Status"
              options={categoryList.poStatus}
              id="status"
              name="name"
              filter={filter}
              setFilter={setFilter}
            ></Dropdown>
          </>
        )
    }

    return (
        <Flex flexDir={"column"} gap={3}>
            <Card variant={"outline"} w={"100%"}>
                <CardHeader borderBottom={"1px ridge #d3d0cf"} py={1}>
                    <Text fontSize={"xl"} fontWeight={"bold"}>Overview</Text>
                </CardHeader>
                <CardBody>
                    <Stack direction={'row'} justifyContent={"center"}>
                        <Flex 
                            w='18%' 
                            h='5em' 
                            align={"center"} 
                            justify={"center"} 
                            flexDir={"column"}
                            borderRight={"2px solid #D9D9D9"}
                        >
                            <Text fontSize={"3xl"} fontWeight={"bold"} >{poData.postedCount}</Text>
                            <Text>Posted</Text>
                        </Flex>
                        <Flex 
                            w='18%' 
                            h='5em' 
                            align={"center"} 
                            justify={"center"} 
                            flexDir={"column"}
                            borderRight={"2px solid #D9D9D9"}
                        >
                            <Text fontSize={"3xl"} fontWeight={"bold"}>{poData.approvedCount}</Text>
                            <Text>Approved</Text>
                        </Flex>
                        <Flex 
                            w='18%' 
                            h='5em' 
                            align={"center"} 
                            justify={"center"} 
                            flexDir={"column"}
                            borderRight={"2px solid #D9D9D9"}
                        >
                            <Text fontSize={"3xl"} fontWeight={"bold"}>{poData.ongoingCount}</Text>
                            <Text>Ongoing</Text>
                        </Flex>
                        <Flex 
                            w='18%' 
                            h='5em' 
                            align={"center"} 
                            justify={"center"} 
                            flexDir={"column"}
                            borderRight={"2px solid #D9D9D9"}
                        >
                            <Text fontSize={"3xl"} fontWeight={"bold"}>{poData.purchasedCount}</Text>
                            <Text>Purchased</Text>
                        </Flex>
                        <Flex 
                            w='18%'
                            h='5em' 
                            align={"center"} 
                            justify={"center"} 
                            flexDir={"column"}
                            borderRight={"2px solid #D9D9D9"}
                        >
                            <Text fontSize={"3xl"} fontWeight={"bold"}>{poData.deliveredCount}</Text>
                            <Text>Delivered</Text>
                        </Flex>
                        <Flex 
                            w='18%' 
                            h='5em' 
                            align={"center"} 
                            justify={"center"} 
                            flexDir={"column"}     
                        >
                            <Text fontSize={"3xl"} fontWeight={"bold"}>{poData.withIssuesCount}</Text>
                            <Text>With Issues</Text>
                        </Flex>
                    </Stack>
                </CardBody>
            </Card>

            <BasicTable 
                DATA={poData.purchaseOrders}
                COLUMNS={COLUMNS}
                FILTERS={filters}
                HIDDEN={[]}
            />
        </Flex>
    )
}

export default PurchaseOrderHomeTab