import { useState } from "react";
import { Flex, Box, FormControl, FormLabel, Input, Stack, Button, Heading, Textarea, useColorModeValue, SimpleGrid, GridItem, Select, useToast } from "@chakra-ui/react";
import { FiEdit3 } from "react-icons/fi";
import { useRouter } from "next/router";
import { createQuestion } from "../services/question";
import Layout from "../components/Layout"
import Head from 'next/head'
import { Image } from "@chakra-ui/image";
import Draggable from 'react-draggable';


export default function CreateQuestion() {
    const router = useRouter();
    const toast = useToast();
    const { quizId } = router.query;
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [description, setDescription] = useState("");
    const [option1, setOption1] = useState("");
    const [option2, setOption2] = useState("");
    const [option3, setOption3] = useState("");
    const [option4, setOption4] = useState("");
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [correctHotspotX, setCorrectHotspotX] = useState("");
    const [correctHotspotY, setCorrectHotspotY] = useState("");
    const [loading, setLoading] = useState(false);
    const [questionType, setQuestionType] = useState("mcq");
    const [marker, setMarker] = useState({ top: null, left: null, width: null, height: null });
    const [dragging, setDragging] = useState(false);

    const handleFileChange = (event) => {
        setImage(event.target.files[0]);
    };

    const startDraw = (event) => {
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setMarker({ top: y, left: x, width: 0, height: 0 });
        setDragging(true);
    }

    const draw = (event) => {
        if (!dragging) {
            return;
        }
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setMarker({ ...marker, width: x - marker.left, height: y - marker.top });
    }

    const endDraw = () => {
        setDragging(false);
        getBoxCoordinates();
    }

    const getBoxCoordinates = () => {
        const { top, left, width, height } = marker;
        console.log(`Top: ${top}, Left: ${left}, Width: ${width}, Height: ${height}`);
    }

    const resetForm = () => {
        setDescription("");
        setOption1("");
        setOption2("");
        setOption3("");
        setOption4("");
        setCorrectAnswer("");
        setCorrectHotspotX("");
        setCorrectHotspotY("");
        setQuestionType("");
        setLoading(false);
    };

    const uploadImage = async (id) => {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "wc2ewopf");
        const response = await fetch("https://api.cloudinary.com/v1_1/dnb0henp1/image/upload", {
            method: "POST",
            body: formData
        });
        const data = await response.json();
        console.log(data.url)
        setImageUrl(data.url);
    };


    const clickSubmit = async () => {
        setLoading(true);
        let options = [];
        let questionData = {};
        if (questionType === "mcq") {
            options = [option1, option2, option3, option4];
            questionData = { description, options, correctAnswer, type: 'MCQ' };
        } else if (questionType === "tf") {
            options = ['True', 'False'];
            questionData = { description, options, correctAnswer: option1, type: 'True/False' };
        } else if (questionType === "hotspot") {
            if (image) {
                await uploadImage();
                if (imageUrl == null) {
                    toast({ title: "Error", description: "Image upload failed", status: "error", duration: 9000, isClosable: true });
                    return;
                }
            }
            questionData = { description, correctAnswer: [correctHotspotX, correctHotspotY], type: 'Hotspot' };
        }
        createQuestion(quizId, questionData).then((data) => {
            if (data?.message) {
                resetForm();
                toast({ title: "Success", description: data?.message, status: "success", duration: 9000, isClosable: true });
                router.push({ pathname: "/quiz_detail", query: { quizId: quizId } });
            } else {
                toast({ title: "Error", description: data?.error, status: "success", duration: 9000, isClosable: true });
            }
        }).finally(() => setLoading(false));
    };

    return (
        <Box>
            <Head>
                <title>Quiz Platform | Create Question</title>
            </Head>
            <Flex justify={"center"} align={"flex-start"} bg={useColorModeValue("gray.50", "gray.800")} mt={2}>
                <Stack spacing={8} mx={"auto"} w={"768px"}>
                    <Stack align={"center"}>
                        <Heading fontSize={"4xl"}>Create Question</Heading>
                    </Stack>
                    <Box rounded={"lg"} bg={useColorModeValue("white", "gray.700")} boxShadow={"lg"} p={8}>
                        <SimpleGrid spacing={6} columns={6} mb={8}>
                            <FormControl id="questionType" as={GridItem} colSpan={6}>
                                <FormLabel>Question Type</FormLabel>
                                <Select placeholder="Select the question type" onChange={(e) => setQuestionType(e.target.value)}>
                                    <option value="mcq">Multiple Choice Question</option>
                                    <option value="tf">True/False</option>
                                    <option value="hotspot">Hotspot</option>
                                </Select>
                            </FormControl>
                            <FormControl id="description" as={GridItem} colSpan={6}>
                                <FormLabel>Question</FormLabel>
                                <Textarea placeholder="Type Question here ..." size="md" onChange={(e) => setDescription(e.target.value)} />
                            </FormControl>
                            {questionType === 'mcq' && (
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
                                </>)}
                            {questionType === 'tf' && (
                                <FormControl id="correctAnswer" as={GridItem} colSpan={6}>
                                    <FormLabel>Answer</FormLabel>
                                    <Select placeholder="Choose the answer" onChange={(e) => setOption1(e.target.value)}>
                                        <option value="True">True</option>
                                        <option value="False">False</option>
                                    </Select>
                                </FormControl>
                            )}
                            {questionType === 'hotspot' && (
                                <>
                                    <FormControl id="questionImage" as={GridItem} colSpan={6}>
                                        <FormLabel fontSize="lg" mb={2}>Upload Image</FormLabel>
                                        <Input type="file" onChange={handleFileChange} />
                                        <Box position={"relative"} mt={4}>
                                            <p mb={2} fontSize="sm" color="gray.500">Uploaded Image:</p>
                                            
                                            {image ? (
                                                <>
                                                    <Image
                                                        boxSize="200px"
                                                        src={imageUrl ? imageUrl : URL.createObjectURL(image)}
                                                        onMouseDown={startDraw}
                                                        onMouseMove={draw}
                                                        onMouseUp={endDraw}
                                                        onDragStart={(event) => event.preventDefault()}
                                                        alt="Hotspot"
                                                        style={{ position: 'relative', display: 'inline-block', overflow: 'hidden', width: '200%', height: '200%' }}
                                                    />
                                                    <Box
                                                        style={{
                                                            position: 'absolute',
                                                            top: marker.top + 'px',
                                                            left: marker.left + 'px',
                                                            width: marker.width + 'px',
                                                            height: marker.height + 'px',
                                                            border: '2px solid red',
                                                            boxSizing: 'border-box',
                                                            pointerEvents: 'none'
                                                        }}
                                                    />
                                                </>
                                            ) : (
                                                <p>No image uploaded yet</p>
                                            )}
                                        </Box>
                                    </FormControl>
                                </>
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