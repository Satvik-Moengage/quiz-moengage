import {
    Box,
    Flex,
    Tag,
    IconButton,
    Heading,
    Text,
    HStack,
    Tooltip,
    Collapse,
    Button,
    Badge
} from "@chakra-ui/react";
import Card from "../components/Card";
import { BsClipboardData } from "react-icons/bs";
import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";
import Layout from "../components/Layout";
import Head from "next/head"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function MySubmissions() {
    const { data: session } = useSession();
    //const { data: attempts } = useSWR("/api/quiz/submissions", fetcher);
    const [userDetails, setUserDetails] = useState(null);
    const userId= session?.user?.id

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
        if (userId) {
            fetchUserDetails(userId);
        }
    }, [userId]);

    const quizTaken = userDetails?.quizzesTaken

    return (
        <Box px={8}>
            <Heading py={5}>My Submissions</Heading>
            <Card>
                {quizTaken?.length === 0 ? (
                    <Text>You haven&apos;t taken any quizzes yet.</Text>
                ) : (
                    <>
                        {quizTaken?.map((item, i) => (
                            <QuizItem key={i} quizTakenItem={item} />
                        ))}
                    </>
                )}
            </Card>
        </Box>
    );
}

const QuizItem = ({ quizTakenItem }) => {
    const router = useRouter();
    const [show, setShow] = useState(false);

    const handleToggle = () => setShow(!show);
    
    return (
        <Box mb={6}>
            <Box onClick={handleToggle} cursor='pointer'>
                {quizTakenItem?.quizTitle}
            </Box>
            <Collapse in={show}>
                {quizTakenItem.attempts.map((attempt, index) => (
                    <Button
                        key={index}
                        onClick={() =>
                            router.push(
                                {
                                    pathname: "/results",
                                    query: {
                                        attemptId: attempt._id,
                                        quizTakenId: quizTakenItem._id
                                    },
                                },
                                "/results"
                            )
                        }
                    >
                        Attempt {index+1}{' '}
                        <Badge ml="1" colorScheme="green">
                            {attempt.score} points
                        </Badge>
                    </Button>
                ))}
            </Collapse>
        </Box>
    );
};

MySubmissions.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};
