import {
    Box,
    Flex,
    IconButton,
    Heading,
    Text,
    Tooltip,
    Tag,
    VStack,
    Button
} from "@chakra-ui/react";
import Card from "../components/Card";
import Layout from "../components/Layout";
import { BsClipboardData } from "react-icons/bs";
import useSWR from "swr";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Head from 'next/head'

const fetcher = (url) => axios.get(url, fetcher).then((resp) => resp.data);

const getPercentageScore = (score, totalResponses) =>
    (score / totalResponses) * 100;

export default function QuizLeaderBoard() {
    const router = useRouter();
    const { quizId } = router.query;
    const { data: users } = useSWR(()=>`/api/quiz/submissions/leaderboard/${quizId}`, fetcher);
    const { data: quiz } = useSWR(() => `/api/quiz/details/${quizId}`, fetcher);
    const { data } = useSession;
    return (
        <Box px={8} style={{ fontFamily: "Poppins" }}>
            <Head>
                <title>Quiz Platform | Leaderboard</title>
            </Head>
            <Heading py={5}>{quiz.title}</Heading>
            <Card>
                {users?.map((quizParticipant) => (
                    <UserItem
                        key={quizParticipant?.entityId}
                        user={quizParticipant}
                        quizId={quizId}
                        isLoggedInUserAdmin={data?.user?.isAdmin}
                    />
                ))}
            </Card>
        </Box>
    );
}

const UserItem = ({ user, isLoggedInUserAdmin, quizId }) => {
    const router = useRouter();
    const quizTaken = user?.quizzesTaken?.find(item=>item.quizId === quizId)
    return (
        <Box mb={6}>
            {quizTaken && quizTaken.attempts.map((attempt, idx) => (
            <Flex alignItems={"center"} justifyContent={"space-between"}>
                <Flex alignItems={"center"}>
                    <Flex
                        alignItems={"flex-start"}
                        justifyContent={"space-between"}
                        flexDirection={"column"}
                    >
                        <Text fontSize={"xl"}>{user?.name}</Text>
                        <Text fontSize={"md"} color={"gray.500"}>
                            {`${getPercentageScore(
                                attempt?.score,
                                attempt?.responses?.length
                            )}%`}
                        </Text>
                    </Flex>
                </Flex>
                <Tag
                    display={{ base: "none", lg: "flex" }}
                    bg={"teal.400"}
                    variant="subtle"
                    size="lg"
                    borderRadius={"full"}
                >
                    {quizTaken?.quizTitle}
                </Tag>
                <Tooltip
                    label={"View Attempt"}
                    hasArrow
                    placement={"top"}
                    bg={"teal"}
                >
                    <IconButton
                        size={"md"}
                        icon={<BsClipboardData />}
                        isRound
                        bg={"cyan.100"}
                        // disabled={!isLoggedInUserAdmin}
                        onClick={() => {
                            router.push(
                                {
                                    pathname: "/results",
                                    query: {
                                        attemptId: attempt?._id,
                                        quizTakenId: quizTaken?._id
                                    },
                                },
                                "/results"
                            );
                        }}
                    />
                </Tooltip>
            </Flex> ))}
            <br />
            <hr
                style={{
                    backgroundColor: "#CBD5E0",
                    color: "#CBD5E0",
                    height: 2,
                }}
            />
        </Box>
    );
};

// const UserItem = ({ user, isLoggedInUserAdmin, quizId }) => {
//     const router = useRouter();

//     const quizTaken =
//         user?.quizzesTaken?.find(quiz => quiz.quizId === quizId);

//     const handleClick = (attemptId) => {
//         // Navigate to 'results', passing attemptId as query parameter
//         router.push({
//             pathname: "/results",
//             query: { attemptId: attemptId, quizTakenId : quizTaken._id },
//         });
//     }

//     return (
//         <Box mb={6}>
//             <Flex alignItems={"center"} justifyContent={quizTaken ? "space-between" : "flex-start"}>
//                 <Flex alignItems={"center"} flexDirection={"column"}>
//                     <Text fontSize={"xl"}>{user.name}</Text>
//                     <Text fontSize={"md"} color={"gray.500"}>
//                         Score: {quizTaken?.attempts?.map(attempt => attempt.score).join(' | ')}
//                     </Text>
//                 </Flex>
//                 {quizTaken && 
//                     quizTaken.attempts.map((attempt, idx) => (
//                         <Button key={idx} onClick={() => handleClick(attempt._id)}>
//                             View Attempt {idx + 1}
//                         </Button>
//                     ))
//                 }
//             </Flex>
//             <br />
//             <hr style={{ backgroundColor: "#CBD5E0", color: "#CBD5E0", height: 2 }}/>
//         </Box>
//     );
// };

QuizLeaderBoard.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};
