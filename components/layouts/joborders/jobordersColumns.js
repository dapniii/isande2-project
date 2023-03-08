import React from "react";
import { Grid, GridItem, Text, Flex } from "@chakra-ui/react";
import GlobalFilter from "@/components/table/globalFilter";

export const COLUMNS = [
  {
    Header: " ",
    id: "rowNumber",
    accessor: "rowNumber",
    filter: GlobalFilter,
    Cell: (props) => {
      return <Flex alignItems={"left"}>{props.row.original.rowNumber}</Flex>;
    },
  },
  {
    Header: "Number",
    id: "number",
    accessor: "number",
    filter: GlobalFilter,
    Cell: (props) => {
        return <Flex alignItems={"center"}>{props.row.original.number}</Flex>;
      },
  },
  {
    Header: "Issue Date",
    id: "issueDate",
    accessor: "issueDate",
    Cell: (props) => {
      return <Flex alignItems={"center"}>{props.row.original.issueDate}</Flex>;
    },
  },
  {
    Header: "Plate Number",
    id: "plateNumber",
    accessor: "plateNumber",
    filter: GlobalFilter,
    Cell: (props) => {
      return (
        <Flex alignItems={"center"}>{props.row.original.plateNumber}</Flex>
      );
    },
  },
  {
    Header: "Status",
    id: "status",
    accessor: "status",
    filter: GlobalFilter,
    Cell: (props) => {
      return <Flex alignItems={"center"}>{props.row.original.status}</Flex>;
    },
  },
  {
    Header: "Assigned To",
    id: "assignedTo",
    accessor: "assignedTo",
    filter: GlobalFilter,
    Cell: (props) => {
      return <Flex alignItems={"center"}>{props.row.original.assignedTo}</Flex>;
    },
  },
  {
    Header: "Job Description",
    id: "jobDescription",
    accessor: "jobDescription",
    filter: GlobalFilter,
  },
];
