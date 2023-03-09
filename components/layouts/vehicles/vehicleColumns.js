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
    Header: "Plate Number",
    id: "plateNumber",
    accessor: "plateNumber",
    filter: GlobalFilter,
  },
  {
    Header: "Status",
    id: "status",
    accessor: "status",
    Cell: (props) => {
      return <Flex alignItems={"center"}>{props.row.original.status}</Flex>;
    },
  },
  {
    Header: "Vehicle Type",
    id: "vehicleType",
    accessor: "vehicleType",
    filter: GlobalFilter,
    Cell: (props) => {
      return (
        <Flex alignItems={"center"}>{props.row.original.vehicleType}</Flex>
      );
    },
  },
  {
    Header: "Brand",
    id: "brand",
    accessor: "brand",
    filter: GlobalFilter,
    Cell: (props) => {
      return <Flex alignItems={"center"}>{props.row.original.brand}</Flex>;
    },
  },
  {
    Header: "Transmission",
    id: "transmission",
    accessor: "transmission",
    filter: GlobalFilter,
    Cell: (props) => {
      return (
        <Flex alignItems={"center"}>{props.row.original.transmission}</Flex>
      );
    },
  },
  {
    Header: "Insurance Expiry",
    id: "insuranceExpiry",
    accessor: "insuranceExpiry",
    filter: GlobalFilter,
  },
];
