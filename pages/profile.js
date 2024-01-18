import {
    Heading,
    Box,
    SimpleGrid,
    GridItem,
    Flex,
    Text,
} from "@chakra-ui/react";
import Card from "../components/Card";
import { useSession } from "next-auth/react";
import Layout from "../components/Layout"
import Head from "next/head"
import { useEffect, useState } from 'react';

export default function Profile(){
    const [userDetails, setUserDetails] = useState(null);
    const { data } = useSession();
    console.log(data?.user?.id)

    const fetchUserDetails = async (userId) => {
        try {
            const response = await fetch(`/api/user/details/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setUserDetails(data);
            } else {
                console.error('Failed to fetch user details', response);
            }
        } catch (error) {
            console.error('Error fetching user details', error);
        }
    };

    useEffect(() => {
        if (data?.user?.id) {
            fetchUserDetails(data.user.id);
        }
    }, [data?.user?.id]);

    return (
        <Box px={8} style={{ fontFamily: "Poppins" }}>
            <Head>
                <title>Quiz Platform | My Profile</title>
            </Head>
            <Heading py={5}>Profile</Heading>
            <Box py={2} mx="auto">
                <SimpleGrid
                    w={{ base: "full", xl: 11 / 12 }}
                    columns={{ base: 1, lg: 11 }}
                    gap={{ base: 0, lg: 16 }}
                    // mx="auto"
                >
                    <GridItem colSpan={{ base: "auto", md: 4 }}>
                        <Card>
                            <Flex alignItems={"center"}>
                                <Heading>{data?.user?.name}</Heading>
                            </Flex>
                        </Card>
                    </GridItem>
                    <GridItem colSpan={{ base: "auto", lg: 7 }}>
                        <Card>
                            <SimpleGrid
                                columns={{ base: 4, md: 2, lg: 2 }}
                                spacing={"20px"}
                            >
                                <Box mx={2}>
                                    <Text
                                        color={"gray.400"}
                                        fontWeight={600}
                                        fontSize="sm"
                                        textTransform={"uppercase"}
                                    >
                                        Name
                                    </Text>
                                    <Text color={"gray.900"} fontSize={"md"}>
                                    {userDetails?.name}
                                    </Text>
                                </Box>
                                <Box mx={2}>
                                    <Text
                                        color={"gray.400"}
                                        fontWeight={600}
                                        fontSize="sm"
                                        textTransform={"uppercase"}
                                    >
                                        Email
                                    </Text>
                                    <Text color={"gray.900"} fontSize={"md"}>
                                    {userDetails?.email}
                                    </Text>
                                </Box>
                                <Box mx={2}>
                                    <Text
                                        color={"gray.400"}
                                        fontWeight={600}
                                        fontSize="sm"
                                        textTransform={"uppercase"}
                                    >
                                        Role
                                    </Text>
                                    <Text color={"gray.900"} fontSize={"md"}>
                                    {userDetails?.isAdmin ? "Administrator" : "Student"}
                                    </Text>
                                </Box>
                                <Box mx={2}>
                                    <Text
                                        color={"gray.400"}
                                        fontWeight={600}
                                        fontSize="sm"
                                        textTransform={"uppercase"}
                                    >
                                        Quizzes Enrolled
                                    </Text>
                                    <Text color={"gray.900"} fontSize={"md"}>
                                    {userDetails?.quizzesEnrolled.length}
                                    </Text>
                                </Box>
                                <Box mx={2}>
                                    <Text
                                        color={"gray.400"}
                                        fontWeight={600}
                                        fontSize="sm"
                                        textTransform={"uppercase"}
                                    >
                                        Quizzes Submitted
                                    </Text>
                                    <Text color={"gray.900"} fontSize={"md"}>
                                    {userDetails?.quizzesTaken.length}
                                    </Text>
                                </Box>
                            </SimpleGrid>
                        </Card>
                    </GridItem>
                </SimpleGrid>
            </Box>
        </Box>
    );
};

Profile.getLayout = function getLayout(page){
    return (
        <Layout>
            {page}
        </Layout>
    )
}