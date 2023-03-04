import React from "react";
import { Text, Flex, Grid, GridItem, Image } from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";

import GlobalFilter from "../table/globalFilter";

export const COLUMNS = [
    {
      Header: "",
      id: "index",
      accessor: (/** @type {any} */ _row, /** @type {number} */ i) => i + 1,
      Cell: (props) => {
        return (
          <>
            <Text fontWeight={"bold"} float={"left"}>
              {props.value}
            </Text>
          </>
        )
      },
      width: 10,
    },
    {
      Header: "",
      id: "photo",
      accessor: "photo",
      Cell: (props) => {
        return (
          <>
            <Image src={props.row.original.photo} 
              alt={props.row.original.name} 
              borderRadius={"1em"}
              border={"2px solid #9F9F9F"}
            
            />
          </>
        )
      },
      width: 90,
    },
    {
      Header: "Item",
      id: "item",
      accessor: "tableItem",
      Cell: (props) => {
        return (
        <>
          <Text fontWeight={"medium"}>{props.row.original.name} ({props.row.original.model})</Text>
          <Text fontSize={"xs"}>{props.row.original.code} </Text>
        </>
      )},
      disableSortBy: true,
      width: 200,
    },
    {
      Header: "Category",
      id: "categoryID",
      accessor: "category",
      filter: (rows, id, filterValue) => {
        return rows.filter(
          (row) =>
            filterValue.length <= 0 ||
            !filterValue ||
            filterValue.includes(row.values[id])
        );
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
      accessor: "qty",
      Cell: (props) => {
        return (
        <>
          <Grid
            w={"5em"}
            gap={1}
            float={"right"}
            templateColumns={"1fr 1fr"}
          >
            <GridItem>
              {{
                "In Stock": <Text color={"green.300"}>⬤</Text>,
                "Low Stock": <Text color={"yellow.300"}>⬤</Text>,
                "Out of Stock": <Text color={"red.400"}>⬤</Text>,      
              }[props.row.original.status] || <Text>⬤</Text>}

            </GridItem>

            <GridItem display={"flex"} flexDirection={"column"}>
              <Text fontSize={"xl"} fontWeight={"bold"}>{props.value}</Text>
              <Text fontSize={"sm"} color={"gray"}>{props.row.original.unit}</Text>
            </GridItem>
          </Grid>
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
          <Text fontSize={"sm"} color={"gray"}>{props.row.original.unit}</Text>
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
          <Text fontSize={"sm"} color={"gray"}>{props.row.original.unit}</Text>
        </>
        )
      },
      disableGlobalFilter: true,
      width: 100,
    },
    {
      // HIDDEN
      Header: "Item Code",
      id: "code",
      accessor: "code",
      Filter: GlobalFilter,
    },
    {
      // HIDDEN
      Header: "Name",
      id: "name",
      accessor: "name",
      Filter: GlobalFilter,
    },
    {
      // HIDDEN
      Header: "Model",
      id: "model",
      accessor: "model",
      Filter: GlobalFilter,
    },
  ];