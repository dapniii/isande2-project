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
    id: "dateTime",
    accessor: "dateTime",
    filter: GlobalFilter,
  },
  {
    Header: "Quantity",
    id: "quantity",
    accessor: "quantity",
    Cell: (props) => {
        return (
            <Flex alignItems={"center"}>
                {props.row.original.quantity}
            </Flex>
        )
    }
  },
  {
    Header: "Unit Price",
    id: "unitPrice",
    accessor: "unitPrice",
    filter: GlobalFilter,
    Cell: (props) => {
      return (
          <Flex alignItems={"center"}>
              {props.row.original.unitPrice}
          </Flex>
      )
  }
  },
  // {
  //   Header: "Fuel(%)",
  //   id: "fuelPercent",
  //   accessor: "fuelPercent",
  //   filter: GlobalFilter,
  //   Cell: (props) => {
  //     return (
  //         <Flex alignItems={"center"}>
  //             {props.row.original.fuelPercent}
  //         </Flex>
  //     )
  // }
  // },
  {
    Header: "Recorded by",
    id: "recordedBy",
    accessor: "recordedBy",
    filter: GlobalFilter,
  },
];
