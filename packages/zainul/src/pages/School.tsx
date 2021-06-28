import {
    Flex,
    Heading,
    Box,
    Stack,
    Image,
    Link as Clink,
    Text,
    IconButton,
} from "@chakra-ui/react";
import React from "react";
import { IoIosSettings } from "react-icons/io";
import { Redirect, Link } from "react-router-dom";
import useAuthorization from "../hooks/useAuthorization";

function School() {
    const { user } = useAuthorization();

    const school = user?.school;

    return (
        <Flex direction="column">
            <Box
                w="full"
                h="300px"
                bgPos="center"
                bgRepeat="no-repeat"
                bg="url(https://images.unsplash.com/photo-1560447992-466be70a0c49?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)"
            ></Box>
            <Stack direction={["column", "row"]} justify="space-between" p="2">
                <Stack
                    align={{ base: "center", md: "flex-start" }}
                    transform="translateY(-50%)"
                >
                    <Image
                        boxSize="8rem"
                        rounded="sm"
                        src="https://images.unsplash.com/photo-1560447992-466be70a0c49?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                    />
                    <Heading size="lg">{school?.name}</Heading>
                    {school === undefined && <Redirect to="/school/create" />}
                    <Clink color="green.200" as={Link} to="/">
                        @{school?.short_name}
                    </Clink>
                    <Text>{school?.description}</Text>
                </Stack>
                <IconButton
                    variant="ghost"
                    colorScheme="white"
                    aria-label="configure school"
                >
                    <IoIosSettings />
                </IconButton>
            </Stack>
        </Flex>
    );
}

export default School;