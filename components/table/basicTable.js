import React, { useMemo, useState } from "react"
import { 
  Flex,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  ButtonGroup,
  Text,
  IconButton,
  Icon,
} from "@chakra-ui/react"
import { useTable, useSortBy, usePagination, useGlobalFilter, useFilters } from "react-table"
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

function BasicTable({
  COLUMNS, 
  DATA,
  FILTERS,
  HIDDEN,
  ID,
  clickRowFunction,
}) {
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => DATA, [DATA])
  var pageSize = 10;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,		
    page,
		nextPage,
		canNextPage,
		previousPage,
		canPreviousPage,
		gotoPage,
		pageOptions,
		pageCount,
    state,
    setGlobalFilter,
    setFilter,
    filters,
  } = useTable(
    {
      columns,
      data,
      initialState: { 
        pageSize: pageSize,
        hiddenColumns: HIDDEN,
      }
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    usePagination,
  );

  const { filter } = state;
  const { globalFilter } = state;
	const { pageIndex } = state;

  function showNumRows() {
    if ((pageIndex+1)*pageSize < rows.length) {
      return (<>{(pageIndex*pageSize + 1)}-{(pageIndex+1)*pageSize} of {rows.length}</>)
    } else 
      return (<>{(pageIndex*pageSize + 1)}-{(pageIndex+1)*pageSize - ((pageIndex+1)*pageSize) % rows.length} of {rows.length}</>)
  }

  return (
    <Flex flexDirection={"column"} bg={"white"} borderRadius={5} boxShadow={"xl"}>
      {/* FILTERS */}
      <Flex w={"100%"} justifyContent={"left"} gap={2} p={"1em"}>
        {FILTERS(filter, setFilter, globalFilter, setGlobalFilter)}
        <hr/>
      </Flex>
      {/* PAGINATION */}
      <ButtonGroup width={"100%"} justifyContent={"right"} alignItems={"center"} px={"1.2em"}>
        <Text fontWeight={"semibold"}>
          {showNumRows()}
        </Text>
        <Flex border={"1px solid #9F9F9F"} borderRadius={"0.5em"} alignItems={"center"}>
          <IconButton
            icon={<Icon as={MdNavigateBefore} boxSize={5} />}
            size={"sm"}
            color={"gray"}
            bg={"blackAlpha.200"}
            borderRight={"0.5px solid #9F9F9F"}
            borderRadius={"none"}
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          />
          <IconButton
            icon={<Icon as={MdNavigateNext} boxSize={5} />}
            size={"sm"}
            color={"gray"}
            bg={"blackAlpha.200"}
            borderLeft={"0.5px solid #9F9F9F"}
            borderRadius={"none"}
            onClick={() => nextPage()}
            disabled={!canNextPage}
          />
        </Flex>

      </ButtonGroup>

      {/* MAIN TABLE */}
      <TableContainer   
        minW={"100%"}
        boxShadow={"lg"}
        borderRadius={5} 

      >
        <Table layout={"fixed"} {...getTableProps()}>
          <Thead>
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  // Add the sorting props to control sorting. For this example
                  // we can add them into the header props
                  <Th 
                    userSelect="none"
                    {...column.getHeaderProps(
                      [column.getSortByToggleProps(),
                      { style: { minWidth: column.minWidth, width: column.width },}
                    ])}
                  >
                    {column.render("Header")}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()}
                    onClick={() =>clickRowFunction(row.original[ID])}
                    transitionDuration="180ms"
                    _hover={{
                      bg: "blackAlpha.300",
                      color: "#222222",
                      transitionDuration: "480ms",
                      cursor: "pointer",
                  }}>
                  {row.cells.map((cell) => {
                    if (Number.isInteger(cell.value)) {
                      return (
                        // <Td>{cell}</Td>
                        <Td isNumeric {...cell.getCellProps(
                          {style: {
                            minWidth: cell.column.minWidth,
                            width: cell.column.width,
                        },})}>{cell.render("Cell")}</Td>
                      );
                    } else {
                      return (
                        <Td {...cell.getCellProps(
                          {style: {
                            minWidth: cell.column.minWidth,
                            width: cell.column.width,
                        },}
                        )}>{cell.render("Cell")}</Td>
                      )
                    }  
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>

      </TableContainer>
    </Flex>
  );
}

export default BasicTable;

