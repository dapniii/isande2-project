import React from "react";
import { Text, Flex, Grid, GridItem, Image } from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";

import GlobalFilter from "@/components/table/globalFilter";

export const COLUMNS = [

    {
      Header: "",
      id: "photo",
      accessor: "imageID.secure_url",
      Cell: (props) => {
        return (
          <>
            <Image src={props.row.original.imageID.secure_url} 
              alt={props.row.original.itemName} 
              borderRadius={"1em"}
              border={"2px solid #9F9F9F"}  
            />
          </>
        )
      },
      width: 100,
    },
    {
      Header: "Item",
      id: "item",
      accessor: "tableItem",
      Cell: (props) => {
        return (
        <>
          <Text fontWeight={"medium"} fontSize={"sm"}>{props.row.original.itemName} 
          {
            props.row.original.itemModel != "" ? (
              <> ({props.row.original.itemModel})</>
            ) : (<></>)
          }
          </Text>
          <Text fontSize={"xs"}>{props.row.original.itemNumber} </Text>
        </>
      )},
      disableSortBy: true,
      width: 170,
    },
    {
      Header: "Category",
      id: "categoryID",
      accessor: "categoryID.name",
      filter: (rows, id, filterValue) => {
        return rows.filter(
          (row) =>
            filterValue.length <= 0 ||
            !filterValue ||
            filterValue.includes(row.values[id])
        );
      },
      Cell: (props) => {
        return (<Text fontSize={"sm"}>{props.value} </Text>)
      },
      width: 120,
    },
    {
      Header: "Status",
      id: "status",
      accessor: "status",
      filter: (rows, id, filterValue) => {
        return rows.filter(
          (row) =>
            filterValue.length <= 0 ||
            !filterValue ||
            filterValue.includes(row.values[id])
        );
      },
      Cell: (props) => {
        return (
          <>
              {{
                "In Stock":            
                  <Flex 
                    bg={"rgba(37, 198, 133, 0.3)"}
                    borderRadius={"30em"} 
                    w={"100%"}
                    px={3.5} 
                    py={0.3}
                    justifyContent={"center"}
                  >
                    <Text color={"#25C685"} fontWeight={"bold"} fontSize={"sm"}>{props.value}</Text>
                  </Flex>, 
                "Low Stock":                   
                  <Flex 
                    bg={"rgba(255, 192, 0, 0.3)"}
                    borderRadius={"30em"} 
                    w={"100%"}
                    px={3.5} 
                    py={0.3}
                    justifyContent={"center"}
                  >
                    <Text color={"#FFC000"} fontWeight={"bold"} fontSize={"sm"}>{props.value}</Text>
                  </Flex>, 
                "Out of Stock":
                  <Flex 
                    bg={"rgba(248, 58, 58, 0.3)"}
                    borderRadius={"30em"} 
                    w={"100%"}
                    px={3.5} 
                    py={0.3}
                    justifyContent={"center"}
                  >
                    <Text color={"#F83A3A"} fontWeight={"bold"} fontSize={"sm"}>{props.value}</Text>
                  </Flex>,      
              }[props.value] || <Text>⬤</Text>}
          </>
        )
      },
      width: 120,
    },
    {
      Header: (props) => {
        return (
          <>
            <Flex float={"right"}>
              {/* Add a sort direction indicator */}
              {props.column.isSorted ? (
                props.column.isSortedDesc ? (
                  <ChevronDownIcon ml={1} w={4} h={4} />
                ) : (
                  <ChevronUpIcon ml={1} w={4} h={4} />
                )
              ) : (
                ""
              )}
              Current Qty
            </Flex>
          </>
        )
      },
      accessor: "quantity",
      Cell: (props) => {
        return (
        <>
            <Flex flexDirection={"column"}>
              <Text fontSize={"xl"} fontWeight={"bold"}>{props.value}</Text>
              <Text fontSize={"sm"} color={"gray"}>{props.row.original.unitID.abbreviation}</Text>
            </Flex>

        </>
        )
     },
    disableGlobalFilter: true,
    width: 100,
    },
    {
      Header:(props) => {
        return (
          <>
            <Flex float={"right"}>
              {/* Add a sort direction indicator */}
              {props.column.isSorted ? (
                props.column.isSortedDesc ? (
                  <ChevronDownIcon ml={1} w={4} h={4} />
                ) : (
                  <ChevronUpIcon ml={1} w={4} h={4} />
                )
              ) : (
                ""
              )}
              Reorder Point
            </Flex>
          </>
        )
      },
      accessor: "reorderPoint",
      Cell: (props) => {
        return (
        <>
          <Text fontSize={"xl"} fontWeight={"bold"}>{props.value}</Text>
          <Text fontSize={"sm"} color={"gray"}>{props.row.original.unitID.abbreviation}</Text>
        </>
        )
      },
      disableGlobalFilter: true,
      // disableSortBy: true,
      width: 100,
    },
    {
      Header: (props) => {
        return (
          <>
            <Flex float={"right"}>
              {/* Add a sort direction indicator */}
              {props.column.isSorted ? (
                props.column.isSortedDesc ? (
                  <ChevronDownIcon ml={1} w={4} h={4} />
                ) : (
                  <ChevronUpIcon ml={1} w={4} h={4} />
                )
              ) : (
                ""
              )}
              EOQ
            </Flex>
          </>
        )
      },
      accessor: "eoq",
      Cell: (props) => {
        return (
        <>
          <Text fontSize={"xl"} fontWeight={"bold"}>{props.value}</Text>
          <Text fontSize={"sm"} color={"gray"}>{props.row.original.unitID.abbreviation}</Text>
        </>
        )
      },
      disableGlobalFilter: true,
      width: 90,
    },
    {
      // HIDDEN
      Header: "Item Code",
      id: "itemNumber",
      accessor: "itemNumber",
      Filter: GlobalFilter,
    },
    {
      // HIDDEN
      Header: "Name",
      id: "itemName",
      accessor: "itemName",
      Filter: GlobalFilter,
    },
    {
      // HIDDEN
      Header: "Model",
      id: "itemModel",
      accessor: "itemModel",
      Filter: GlobalFilter,
    },
  ];