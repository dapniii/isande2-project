import {
    Flex,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    StatGroup,
  } from '@chakra-ui/react'
  
export default function PartsHomeTab() {
    return (
        <Flex flexDirection={"column"}>
            <StatGroup bg={"white"} p={5} boxShadow={"xl"} borderRadius={5}>
                <Stat>
                    <StatLabel>Total Inventory Value</StatLabel>
                    <StatNumber>P 345,670</StatNumber>
                    <StatHelpText>
                    <StatArrow type='increase' />
                    23.36%
                    </StatHelpText>
                </Stat>

                <Stat>
                    <StatLabel>Low Stock</StatLabel>
                    <StatNumber>45</StatNumber>
                    <StatHelpText>
                    <StatArrow type='decrease' />
                    9.05%
                    </StatHelpText>
                </Stat>

                <Stat>
                    <StatLabel>Out of Stock</StatLabel>
                    <StatNumber>45</StatNumber>
                    <StatHelpText>
                    <StatArrow type='decrease' />
                    9.05%
                    </StatHelpText>
                </Stat>
            </StatGroup>
        </Flex>
    )
}