import React from "react";
import { Grid, GridItem, Text, Flex } from "@chakra-ui/react";
import GlobalFilter from "@/components/table/globalFilter";

export const COLUMNS = [
  {
    Header: "Refuel Type",
    id: "refuelType",
    accessor: "refuelType",
    filter: GlobalFilter,
  },
  {
    Header: "Date & Time",
    accessor: "fRecordDateTime",
    Cell(props) {
      return `${props.row.original.formattedDate}`;
    },
    filter: GlobalFilter,
  },
  {
    Header: "Quantity",
    accessor: "fLiters",
    Cell: (props) => {
      return <Flex alignItems={"center"}>{props.row.original.fLiters + ' L'}</Flex>;
    },
  },
  {
    Header: "Unit Cost",
    accessor: "fUnitCost",
    filter: GlobalFilter,
    Cell: (props) => {
      return <Flex alignItems={"center"}>{'₱ ' + props.row.original.fUnitCost}</Flex>;
    },
  },
  {
    Header: "Recorded by",
    id: "recordedby",
    Cell(props) {
      const { user } = props.row.original;
      return `${user.firstName} ${user.lastName}`;
    },
    filter: GlobalFilter,
  },
];

export const FUEL_OUT_COLUMNS = [
  {
    Header: "Refuel Type",
    id: "refuelType",
    accessor: "refuelType",
    filter: GlobalFilter,
  },
  {
    Header: "Date & Time",
    accessor: "oRecordDateTime",
    Cell(props) {
      return `${props.row.original.formattedDate}`;
    },
    filter: GlobalFilter,
  },
  {
    Header: "Driver",
    accessor: "oDriver",
    Cell: (props) => {
      return <Flex alignItems={"center"}>{props.row.original.oDriver}</Flex>;
    },
  },
  {
    Header: "Plate Number",
    id:"oPlateNumber",
    accessor: "oPlateNumber",
    Cell: (props) => {
      return <Flex alignItems={"center"}>{props.row.original.oPlateNumber}</Flex>;
    },
  },
  {
    Header: "Previous Route",
    accessor: "oPreviousRoute",
    Cell: (props) => {
      return <Flex alignItems={"center"}>{props.row.original.oPreviousRoute}</Flex>;
    },
  },
  {
    Header: "Quantity",
    accessor: "ofLiters",
    Cell: (props) => {
      return <Flex alignItems={"center"}>{props.row.original.ofLiters + ' L'}</Flex>;
    },
  },
  {
    Header: "Recorded by",
    id: "recordedby",
    Cell(props) {
      const { user } = props.row.original;
      return `${user.firstName} ${user.lastName}`;
    },
    filter: GlobalFilter,
  },
];
