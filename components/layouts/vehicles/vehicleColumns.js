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
        <>
          {{
            "Active":            
              <Flex 
                bg={"rgba(37, 198, 133, 0.3)"}
                borderRadius={"30em"} 
                w={"90%"}
                px={3.5} 
                py={0.3}
                justifyContent={"center"}
              >
                <Text color={"#25C685"} fontWeight={"bold"} fontSize={"sm"}>{props.value}</Text>
              </Flex>, 
            "Repair":                   
              <Flex 
                bg={"rgba(255, 192, 0, 0.3)"}
                borderRadius={"30em"} 
                w={"90%"}
                px={3.5} 
                py={0.3}
                justifyContent={"center"}
              >
                <Text color={"#FFC000"} fontWeight={"bold"} fontSize={"sm"}>{props.value}</Text>
              </Flex>, 
            "Inactive":
              <Flex 
                bg={"rgba(248, 58, 58, 0.3)"}
                borderRadius={"30em"} 
                w={"90%"}
                px={3.5} 
                py={0.3}
                justifyContent={"center"}
              >
                <Text color={"#F83A3A"} fontWeight={"bold"} fontSize={"sm"}>{props.value}</Text>
              </Flex>,  
            "Travelling":
              <Flex 
                bg={"rgba(0, 93, 242, 0.35)"}
                borderRadius={"30em"} 
                w={"90%"}
                px={3.5} 
                py={0.3}
                justifyContent={"center"}
              >
                <Text color={"#005DF2"} fontWeight={"bold"} fontSize={"sm"}>{props.value}</Text>
              </Flex>,     
          }[props.value] || <Text>⬤</Text>}
      </>
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
