import { useEffect, useState } from "react";
import { Heading, Box, SimpleGrid, GridItem } from "@chakra-ui/react";
import Info from "../components/quiz/Info";
import Questions from "../components/quiz/Questions";
import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";
import Layout from "../components/Layout"
import EnrollUsers from '../components/quiz/EnrollUsers'
import Head from "next/head"
import { VStack } from "@chakra-ui/react";

const fetcher = (url) => axios.get(url).then((resp) => resp.data);
export default function QuizDetails() {
    const router = useRouter();
    const [quizId, setQuizId] = useState("");
    useEffect(() => {
        const { quizId: id } = router.query;
        if (id) {
            setQuizId(id);
        }
    }, [router]);
    const { data: quiz } = useSWR(() => `/api/quiz/details/${quizId}`, fetcher);
    return (
        <Box px={8} style={{ fontFamily: "Poppins" }}>
            <Head>
                <title>Quiz Platform | Quiz Details</title>
            </Head>
            <Heading py={5}>Quiz Details</Heading>
            <Box py={2} mx="auto">
                <SimpleGrid
                    w={{ base: "full", xl: 11 / 12 }}
                    columns={{ base: 1, lg: 11 }}
                    gap={{ base: 0, lg: 16 }}
                >
                    <GridItem colSpan={{ base: "auto", md: 4 }}>
                        <VStack spacing={10}>
                            <Info quiz={quiz} />
                            <EnrollUsers quiz={quiz} />
                        </VStack>
                    </GridItem>
                    <GridItem colSpan={{ base: "auto", lg: 7 }}>
                        <Questions quiz={quiz} />
                    </GridItem>
                </SimpleGrid>
            </Box>
        </Box>
    );
};
QuizDetails.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}