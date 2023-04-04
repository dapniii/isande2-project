import { Text, Flex, Image} from "@chakra-ui/react";
import GlobalFilter from "@/components/table/globalFilter";

export const COLUMNS = [
    {
        Header: "",
        id: "photo",
        accessor: (/** @type {any} */ _row, /** @type {number} */ i) => String(i + 1),
        Cell: (props) => {
          return (
            <Flex flexDir={"column"} gap={5}>
                <Text fontSize={"xl"} fontWeight={"semibold"}>{props.value+ " " + props.row.original.name}</Text>
                <Flex gap={10}>
                    <Image 
                        src={props.row.original.imageID.secure_url} 
                        alt={props.row.original.name} 
                        borderRadius={"1em"}
                        border={"2px solid #9F9F9F"}
                        w={"10em"}  
                        h={"10em"}
                        objectFit={"cover"}
                    />
                    <Flex flexDir={"column"} gap={3}>
                        <Text>
                            {props.row.original.streetAddress}, {" "}
                            {props.row.original.cityID.name}, {" "}
                            {props.row.original.provinceID.name}
                        </Text>
                        <Text>{props.row.original.email}</Text>
                        <Text>{props.row.original.phone}</Text>
                    </Flex>
                </Flex>

            </Flex>
          )
        },
    },
    {
        Header: "",
        id: "supplierName",
        accessor: "name",
        filter: GlobalFilter
    },
    {
        Header: "",
        id: "streetAddress",
        accessor: "streetAddress",
        filter: GlobalFilter,
    },
    {
        Header: "",
        id: "city",
        accessor: "city",
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
        Header: "",
        id: "province",
        accessor: "province",
        filter: (rows, id, filterValue) => {
            return rows.filter(
              (row) =>
                filterValue.length <= 0 ||
                !filterValue ||
                filterValue.includes(row.values[id])
            );
        },
    }
]