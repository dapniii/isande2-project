import React from "react";
import { Grid, GridItem, Text, Flex } from "@chakra-ui/react";
import GlobalFilter from "@/components/table/globalFilter";

export const COLUMNS = [
  // {
  //   Header: "",
  //   id: "index",
  //   accessor: (/** @type {any} */ _row, /** @type {number} */ i) => i + 1,
  //   Cell: (props) => {
  //     return (
  //       <>
  //         <Text fontWeight={"bold"} float={"left"}>
  //           {props.value}
  //         </Text>
  //       </>
  //     )
  //   },
  //   width: 10,
  // },
  {
    Header: "",
    id: "joNumber",
    accessor: "jobOrderID",
    filter: GlobalFilter,
    width: 70,
  },
  {
    Header: "Plate Number",
    id: "plateNumber",
    accessor: "vehicleID.plateNumber",
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
    Header: "Issue Date",
    id: "issueDate",
    accessor: "creationDate",
    Cell: (props) => {
      return <Flex alignItems={"center"}>{new Date(props.value).toDateString()}</Flex>;
    },
  },
  {
    Header: "Status",
    id: "status",
    accessor: "statusID.name",
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
    Header: "Assigned To",
    id: "assignedTo",
    accessor: "mechanics",
    Cell: (props) => {
        return (
          <Flex flexDirection={"column"} gap={2}>
            {
              props.value.map(value => {
                return <Text>{value.mechanicID.userID.firstName + " " + value.mechanicID.userID.lastName}</Text>
              }) 
            }
          </Flex>

        )     
    },
  },
  {
    Header: "Job Description",
    id: "jobDescription",
    accessor: "description",
  },
];
