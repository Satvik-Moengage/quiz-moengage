import {
    Heading,
    Flex,
    Box,
    Text,
    SimpleGrid,
    Button,
} from "@chakra-ui/react";
import Card from "../Card";
import { useRouter } from "next/router";

const Info = ({ quiz }) => {
    const router = useRouter();
    let schd = new Date(quiz?.scheduledFor?.replace("Z", ""));
    return (
        <Card>
            <Flex alignItems={"center"}>
                <Heading>{quiz?.title}</Heading>
            </Flex>
            <Box mt={2}>
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
                            Duration
                        </Text>
                        <Text color={"gray.900"} fontSize={"md"}>
                            {quiz?.duration} min
                        </Text>
                    </Box>
                    <Box mx={2}>
                        <Text
                            color={"gray.400"}
                            fontWeight={600}
                            fontSize="sm"
                            textTransform={"uppercase"}
                        >
                            Quiz Code
                        </Text>
                        <Text color={"gray.900"} fontSize={"md"}>
                            {quiz?.quizCode}
                        </Text>
                    </Box>
                    <Box mx={2}>
                        <Text
                            color={"gray.400"}
                            fontWeight={600}
                            fontSize="sm"
                            textTransform={"uppercase"}
                        >
                            Quiz Starts At
                        </Text>
                        <Text color={"gray.900"} fontSize={"md"}>
                            {new Date(quiz?.scheduledFor?.replace("Z", "")).toLocaleString()}
                            {/* {quiz?.scheduledFor} */}
                        </Text>
                    </Box>
                    <Button
                        onClick={() =>
                            router.push(
                                {
                                    pathname: "/quiz_leaderboard",
                                    query: { quizId: quiz?.id },
                                },
                                "/quiz_leaderboard"
                            )
                        }
                    >
                        View Submissions
                    </Button>
                </SimpleGrid>
                <Box mx={2} my={5}>
                    <Text
                        color={"gray.400"}
                        fontWeight={600}
                        fontSize="sm"
                        textTransform={"uppercase"}
                    >
                        Description
                    </Text>
                    <Text color={"gray.900"} fontSize={"md"}>
                        {quiz?.description}
                    </Text>
                </Box>
            </Box>
        </Card>
    );
};

export default Info;
