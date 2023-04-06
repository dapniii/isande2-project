import { 
    Flex,
    Text 
} from "@chakra-ui/react";

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
        Header: "Supplier",
        id: "supplier",
        accessor: "supplierID.name",
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
        Header: "Items",
        id: "items",
        accessor: "partsList.length",
        Cell: (props) => {
            return (
                props.value == 1
                    ? (
                        <Flex w={"100%"}>
                            <Text textDecor={"underline"}>{props.value} Item</Text>
                        </Flex>
                    ) 
                    : (                        
                        <Flex w={"100%"}>
                            <Text textDecor={"underline"}>{props.value} Items</Text>
                        </Flex>
                    ) 
            )
        }
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
        Header: "Total Cost",
        id: "totalCost",
        accessor: "totalCost",
        Cell: (props) => {
            return (
                <Text>PHP {props.value.toFixed(2)}</Text>
            )
        }
    }
]