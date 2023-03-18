import React from "react";
import { Grid, GridItem, Text, Flex, Image } from "@chakra-ui/react";
import GlobalFilter from "@/components/table/globalFilter";

export const COLUMNS = [
  // {
  //   Header: " ",
  //   id: "rowNumber",
  //   accessor: "rowNumber",
  //   filter: GlobalFilter,
  //   Cell: (props) => {
  //     return <Flex alignItems={"left"}>{props.row.original.index}</Flex>;
  //   },
  // },
  {
    Header: "",
    id: "photo",
    accessor: "imageID.secure_url",
    Cell: (props) => {
      return (
        <>
          <Image src={props.row.original.imageID.secure_url} 
            alt={props.row.original.plateNumber} 
            borderRadius={"1em"}
            border={"2px solid #9F9F9F"}  
          />
        </>
      )
    },
    width: 100,
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
    accessor: "vehicleStatusID.name",
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
        <Flex gap={2}>
          {{
            "Active": <Text color={"#25C685"}>⬤</Text>,
            "Travelling": <Text color={"#005DF2"}>⬤</Text>,
            "Repair": <Text color={"#FFC000"}>⬤</Text>,   
            "Inactive": <Text color={"#F83A3A"}>⬤</Text>,      
          }[props.row.original.vehicleStatusID.name] || <Text>⬤</Text>}
          <Flex alignItems={"center"}>{props.row.original.vehicleStatusID.name}</Flex>
        </Flex>
      )
    },
  },
  {
    Header: "Vehicle Type",
    id: "vehicleType",
    accessor: "vehicleTypeID",
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
        <Flex alignItems={"center"}>{props.row.original.vehicleTypeID.name}</Flex>
      );
    },
  },
  {
    Header: "Brand",
    id: "brand",
    accessor: "brandID",
    Cell: (props) => {
      return <Flex alignItems={"center"}>{props.row.original.brandID.name}</Flex>;
    },
  },
  {
    Header: "Transmission",
    id: "transmission",
    accessor: "transmissionID",
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
        <Flex alignItems={"center"}>{props.row.original.transmissionID.name}</Flex>
      );
    },
  },
  {
    Header: "Insurance Expiry",
    id: "insuranceExpiry",
    accessor: "insuranceExpiry",
    Cell: (props) => {
      return (
        <Flex alignItems={"center"}>{new Date(props.row.original.insuranceExpiry).toLocaleDateString()}</Flex>
      )
    }
  },
];
