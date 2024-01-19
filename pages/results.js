import { useState, useEffect } from "react";
import {
    Heading,
    Box,
    Flex,
    Text,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    Icon,
    Stack,
    Image
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Card from "../components/Card";
import Layout from "../components/Layout";
import Loader from "../components/common/Loader";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import {
    IoCheckmarkDoneOutline,
    IoCloseOutline,
    IoWarningOutline,
    IoDiscOutline,
} from "react-icons/io5";

import useSWR from "swr";
import axios from "axios";
import Head from "next/head";
import { useSession } from "next-auth/react";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function Results() {
    const router = useRouter();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [userDetails, setUserDetails] = useState(null);
    const userId = session?.user?.id

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
    const { attemptId } = router.query;
    const { quizTakenId } = router.query
    const { data: attemptInfo } = useSWR(
        () => `/api/quiz/attempt/${attemptId}`,
        fetcher
    );
    useEffect(() => {
        if (attemptInfo) {
            setLoading(false);
        }
    }, [attemptInfo]);
    const quizId = attemptInfo?.responses[0]?.quizId;

    const { data: questions, error: questionsError } = useSWR(
        () => `/api/question/creating/${quizId}`,
        fetcher
    );

    const questionsMap = new Map(questions?.map(q => [q._id, q]));

    attemptInfo?.responses.forEach(response => {
        const question = questionsMap.get(response.questionId);
        if (question) {
            if (question.imageUrl) {
                response.imageUrl = question.imageUrl;
            }
            if (question.type) {
                response.type = question.type;
            }
        }
    });

    const quizTaken = userDetails?.quizzesTaken?.find(item => item._id === quizTakenId)
    return (
        <Box px={8} style={{ fontFamily: "Poppins" }}>
            <Head>
                <title>Quiz Platform | Results</title>
            </Head>
            <Heading py={5}>Results</Heading>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <Card>
                        <Flex
                            alignItems={"center"}
                            justifyContent={"space-between"}
                        >
                            <Flex alignItems={"center"}>
                                <Text fontSize={"xl"}>
                                    {quizTaken?.quizTitle}
                                </Text>
                            </Flex>
                            <Text fontSize={"md"}>
                                You scored {attemptInfo?.score} /{" "}
                                {attemptInfo?.responses?.length}
                            </Text>
                        </Flex>
                    </Card>
                    <Box mb={4} />
                    <Card>
                        <Heading py={5}>Responses</Heading>
                        <Accordion allowToggle>
                            {attemptInfo?.responses?.map((resp, i) => (
                                <QuestionItem key={i} response={resp} />
                            ))}
                        </Accordion>
                    </Card>
                </>
            )}
        </Box>
    );
}

const QuestionItem = ({ response }) => {
    

    const respIcon = (resp) => {
        if(resp.type === "Hotspot"){
            // console.log(resp)
            const userClickedTop = resp.selected.top;
                const userClickedLeft = resp.selected.left;

                const correctTop = resp.correctAnswer.top;
                const correctLeft = resp.correctAnswer.left;
                const correctBottom = correctTop + resp.correctAnswer.height;
                const correctRight = correctLeft + resp.correctAnswer.width;

                if (
                    userClickedTop >= correctTop &&
                    userClickedTop <= correctBottom &&
                    userClickedLeft >= correctLeft &&
                    userClickedLeft <= correctRight
                ) {
                    return (
                        <Icon as={IoCheckmarkDoneOutline} w={4} h={5} color={"green"} />
                    );
                }
                else if (String(resp?.selected) === null) {
                    return (
                        <Icon as={IoWarningOutline} w={4} h={5} color={"goldenrod"} />
                    );
                } else {
                    return <Icon as={IoCloseOutline} w={4} h={5} color={"red"} />;
                }
        }
        else{
            if (
                String(resp?.selected).toLowerCase() ===
                String(resp?.correctAnswer).toLowerCase()
            ) {
                return (
                    <Icon as={IoCheckmarkDoneOutline} w={4} h={5} color={"green"} />
                );
            } else if (String(resp?.selected) === null) {
                return (
                    <Icon as={IoWarningOutline} w={4} h={5} color={"goldenrod"} />
                );
            } else {
                return <Icon as={IoCloseOutline} w={4} h={5} color={"red"} />;
            }
        }
        
    };

    return (
        <AccordionItem my={3}>
            {({ isExpanded }) => (
                <>
                    <Heading as="h3" size={"sm"}>
                        <AccordionButton>
                            <Icon
                                as={isExpanded ? FiChevronDown : FiChevronRight}
                                w={6}
                                h={6}
                            />
                            <Box flex="1" textAlign="left">
                                {response?.description}
                            </Box>
                            {respIcon(response)}
                        </AccordionButton>
                    </Heading>
                    <AccordionPanel pb={4}>
                        {['MCQ', 'MCM', 'True/False'].includes(response.type) ? (
                            <Stack spacing={4} direction={"column"}>
                                {response.options.map((opt, i) => (
                                    <OptionItem
                                        resp={response}
                                        text={opt}
                                        key={i}
                                    />
                                ))}
                            </Stack>
                        ) : response.type === 'Hotspot' ? (
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                <Image src={response.imageUrl} style={{ width: '750px', height: '500px' }} />
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: response.correctAnswer.top,
                                        left: response.correctAnswer.left,
                                        width: response.correctAnswer.width,
                                        height: response.correctAnswer.height,
                                        border: '2px solid green',  // Or any other indication you want for the box
                                        boxSizing: 'border-box'
                                    }}
                                />
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: response.selected.top,
                                        left: response.selected.left,
                                        border: '5px solid red',
                                        boxSizing: 'border-box'
                                    }}
                                />

                            </div>
                        ) : null}
                    </AccordionPanel>
                </>
            )}
        </AccordionItem>
    );
};

const OptionItem = ({ resp, text }) => {
    const isCorrectAnswer = resp.correctAnswer.includes(text);
    const isSelectedAnswer = resp.selected.includes(text);

    let optionColor;
    if (isCorrectAnswer && isSelectedAnswer) {
        optionColor = 'green';
    } else if (isCorrectAnswer && !isSelectedAnswer) {
        optionColor = 'red.500';
    } else if (!isCorrectAnswer && isSelectedAnswer) {
        optionColor = 'red.500';
    } else {
        optionColor = 'gray.800';
    }

    return (
        <Stack spacing={4} direction={'row'} alignItems={'center'}>
            <Icon
                as={IoDiscOutline}
                w={4}
                h={4}
                color={optionColor}
            />
            <Text color={optionColor}>
                {text}
            </Text>
            {!isCorrectAnswer && isSelectedAnswer && (
                <Text color="red.500" fontSize="sm">
                    (Your Answer)
                </Text>
            )}
            {isCorrectAnswer && !isSelectedAnswer && (
                <Text color="red.500" fontSize="sm">
                    (Missed Correct Answer)
                </Text>
            )}
            {isCorrectAnswer && isSelectedAnswer && (
                <Text color="green" fontSize="sm">
                    (Correct Answer)
                </Text>
            )}
        </Stack>
    );
};

Results.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};
