import React from "react";
import { Grid, GridItem, Text, Flex, Image } from "@chakra-ui/react";
import GlobalFilter from "@/components/table/globalFilter";
import { addCommasToNum } from "@/lib/dataHandler";

export const COLUMNS = [
    {
        Header: "Number",
        id: "joNumber",
        accessor: "jobOrderID",
        filter: GlobalFilter,
    },
    {
        Header: "Issue Date",
        id: "issueDate",
        accessor: "createdAt",
        Cell: (props) => {
            return (
                <Text>{new Date(props.value).toLocaleDateString()}</Text>
            )
        }
    },
    {
        Header: "Assigned To",
        id: "assignedTo",
        accessor: "assignedMechanics",
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
        Header: "Tasks",
        id: "jobList",
        accessor: "jobList",
        Cell: (props) => {
            return (
              <Flex flexDirection={"column"} gap={2}>
                {
                  props.value.map(value => {
                    return <Text>{value.jobID.name}</Text>
                  }) 
                }
              </Flex>
    
            )     
        },
    },
    {
        Header: "Description",
        id: "description",
        accessor: "description",
    },
    {
        Header: "Total Cost",
        id: "totalCost",
        accessor: "jobOrderCost",
        Cell: (props) => {
            return (
                <Flex w={"100%"}>
                    <Text>PHP {addCommasToNum(props.value.toFixed(2))}</Text>
                </Flex>
            )
        }
    }
];
