import { useState } from "react";
import { Flex, Box, FormControl, FormLabel, Input, Stack, Button, Heading, Textarea, useColorModeValue, SimpleGrid, GridItem, Select, useToast } from "@chakra-ui/react";
import { FiEdit3 } from "react-icons/fi";
import { useRouter } from "next/router";
import { createQuestion } from "../services/question";
import Layout from "../components/Layout"
import Head from 'next/head'

export default function CreateQuestion() {
    const router = useRouter();
    const toast = useToast();
    const { quizId } = router.query;
    const [description, setDescription] = useState("");
    const [option1, setOption1] = useState("");
    const [option2, setOption2] = useState("");
    const [option3, setOption3] = useState("");
    const [option4, setOption4] = useState("");
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [questionType, setQuestionType] = useState("mcq");

    const resetForm = () => {
        setDescription("");
        setOption1("");
        setOption2("");
        setOption3("");
        setOption4("");
        setCorrectAnswer("");
        setQuestionType("mcq");
        setLoading(false);
    };

    const clickSubmit = async () => {
        setLoading(true);

        let options = [];
        let questionData = {};

        if (questionType === "mcq") {
            options = [option1, option2, option3, option4];
            questionData = { description, options, correctAnswer };
        } else if (questionType === "tf") {
            options = ['True', 'False'];
            questionData = { description, options, correctAnswer: option1 };
        }

        createQuestion(quizId, questionData)
            .then((data) => {
                console.log(data)
                if (data?.message) {
                    resetForm();
                    toast({ title: "Success", description: data?.message, status: "success", duration: 9000, isClosable: true });
                    router.push({ pathname: "/quiz_detail", query: { quizId: quizId } });
                } else {
                    toast({ title: "Error", description: data?.error, status: "success", duration: 9000, isClosable: true });
                }
            })
            .finally(() => setLoading(false));
    };

    return (
        <Box>
            <Head>
                <title>Quiz Platform | Create Question</title>
            </Head>
            <Flex
                justify={"center"}
                align={"flex-start"}
                bg={useColorModeValue("gray.50", "gray.800")}
                mt={2}
            >
                <Stack spacing={8} mx={"auto"} w={"768px"}>
                    <Stack align={"center"}>
                        <Heading fontSize={"4xl"}>Create Question</Heading>
                    </Stack>
                    <Box
                        rounded={"lg"}
                        bg={useColorModeValue("white", "gray.700")}
                        boxShadow={"lg"}
                        p={8}
                    >
                        <SimpleGrid spacing={6} columns={6} mb={8}>
                        <FormControl id="questionType" as={GridItem} colSpan={6}>
                                <FormLabel>Question Type</FormLabel>
                                <Select placeholder="Select the question type" onChange={(e) => setQuestionType(e.target.value)}>
                                    <option value="mcq">Multiple Choice Question</option>
                                    <option value="tf">True/False</option>
                                </Select>
                            </FormControl>
                            <FormControl id="description" as={GridItem} colSpan={6}>
                                <FormLabel>Description</FormLabel>
                                <Textarea placeholder="Type Description here ..." size="md" onChange={(e) => setDescription(e.target.value)} />
                            </FormControl>

                            {questionType === 'mcq' ? (
                                <>
                                    <FormControl id="option1" as={GridItem} colSpan={[6, 3]}>
                                        <FormLabel>Option 1</FormLabel>
                                        <Input variant={"flushed"} color={"gray.500"} placeholder={"Option 1"} onChange={(e) => setOption1(e.target.value)} />
                                    </FormControl>
                                    <FormControl id="option2" as={GridItem} colSpan={[6, 3]}>
                                        <FormLabel>Option 2</FormLabel>
                                        <Input variant={"flushed"} color={"gray.500"} placeholder={"Option 2"} onChange={(e) => setOption2(e.target.value)} />
                                    </FormControl>
                                    <FormControl id="option3" as={GridItem} colSpan={[6, 3]}>
                                        <FormLabel>Option 3</FormLabel>
                                        <Input variant={"flushed"} color={"gray.500"} placeholder={"Option 3"} onChange={(e) => setOption3(e.target.value)} />
                                    </FormControl>
                                    <FormControl id="option4" as={GridItem} colSpan={[6, 3]}>
                                        <FormLabel>Option 4</FormLabel>
                                        <Input variant={"flushed"} color={"gray.500"} placeholder={"Option 4"} onChange={(e) => setOption4(e.target.value)} />
                                    </FormControl>

                                    <FormControl id="correctAns" as={GridItem} colSpan={6}>
                                        <FormLabel>Correct Answer</FormLabel>
                                        <Select placeholder="Choose the correct Answer" onChange={(e) => setCorrectAnswer(e.target.value)}>
                                            <option value={option1}>{option1}</option>
                                            <option value={option2}>{option2}</option>
                                            <option value={option3}>{option3}</option>
                                            <option value={option4}>{option4}</option>
                                        </Select>
                                    </FormControl>
                                </>) : (
                                <FormControl id="correctAnswer" as={GridItem} colSpan={6}>
                                    <FormLabel>Answer</FormLabel>
                                    <Select placeholder="Choose the answer" onChange={(e) => setOption1(e.target.value)}>
                                        <option value="True">True</option>
                                        <option value="False">False</option>
                                    </Select>
                                </FormControl>
                            )}
                        </SimpleGrid>
                        <Stack spacing={10}>
                            <Button bg={"blue.400"} color={"white"} leftIcon={<FiEdit3 />} loadingText={"Saving"} isLoading={loading} _hover={{ bg: "blue.500" }} onClick={clickSubmit}>
                                Create
                            </Button>
                        </Stack>
                    </Box>
                </Stack>
            </Flex>
        </Box>
    );
}

CreateQuestion.getLayout = function getLayout(page) {
    return (
        <Layout>{page}</Layout>
    )
}