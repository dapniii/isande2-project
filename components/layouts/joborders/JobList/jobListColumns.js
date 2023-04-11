import React from "react";
import { Grid, GridItem, Text, Flex } from "@chakra-ui/react";
import GlobalFilter from "@/components/table/globalFilter";

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
    Header: "Job Name",
    id: "jobName",
    accessor: "name",
    filter: GlobalFilter,
  },
  {
    Header: "Category",
    id: "category",
    accessor: "categoryID.name",
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
    Header: "Description",
    id: "description",
    accessor: "description",
    filter: GlobalFilter
  },
  {
    Header: "Items",
    id: "itemCount",
    accessor: "jobItems.length",
    Cell: (props) => {
      if (props.value == 1) {
        return (
          <Flex>
            <Text textDecoration={"underline"}>{String(props.value)} item</Text>
          </Flex>
        )
      }
      else {
        return (
          <Flex>
            <Text textDecoration={"underline"}>{String(props.value)} items</Text>
          </Flex>
        )
      }

    }
  }

];
