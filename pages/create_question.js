import { useState, useEffect } from "react";
import { Flex, Box, FormControl, FormLabel, Checkbox, Input, Stack, Button, Heading, Textarea, useColorModeValue, SimpleGrid, GridItem, Select, useToast, RadioGroup, Radio, HStack, Text } from "@chakra-ui/react";
import { FiEdit3 } from "react-icons/fi";
import { useRouter } from "next/router";
import { createQuestion } from "../services/question";
import Layout from "../components/Layout"
import Head from 'next/head'
import { Image } from "@chakra-ui/image";
import { v4 as uuidv4 } from 'uuid';

export default function CreateQuestion() {
    const router = useRouter();
    const toast = useToast();
    const { quizId } = router.query;
    const image_url = null
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState("");
    const [correctAnswer, setCorrectAnswer] = useState([]);
    const [loading, setLoading] = useState(false);
    const [questionType, setQuestionType] = useState("");
    const [marker, setMarker] = useState({ top: null, left: null, width: null, height: null });
    const [dragging, setDragging] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [options1, setOptions] = useState([""])
    const [sentences, setSentences] = useState([""]);

    const handleAddSentence = () => {
        setSentences([...sentences, ""]);
    };

    const handleSentenceChange = (index, event) => {
        const newSentences = [...sentences];
        newSentences[index] = event.target.value;
        setSentences(newSentences);
    };

    const handleAddOption = () => {
        setOptions([...options1, ""]);
    };

    const handleOptionChange = (index, event) => {
        const newOptions = [...options1];
        newOptions[index] = event.target.value;

        if (index === 0 && correctAnswer === '') {
            setCorrectAnswer(newOptions[0]);
        }

        setOptions(newOptions);
    };

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
        return marker
    }

    const resetForm = () => {
        setDescription("");
        setCorrectAnswer("");
        setQuestionType("");
        setLoading(false);
    };

    const uploadImage = async () => {
        try {
            const formData = new FormData();
            formData.append("file", image);
            formData.append("upload_preset", "wc2ewopf");
            const response = await fetch("https://api.cloudinary.com/v1_1/dnb0henp1/image/upload", {
                method: "POST",
                body: formData
            })
            const data = await response.json()
            image_url = data.url
        }

        catch {
            console.log("Error");
        }
    }

    const clickSubmit = async () => {
        setLoading(true);
        let questionData = {};
        if (questionType === "mcq") {
            questionData = { description, options: options1, correctAnswer, type: 'MCQ' };
        }
        if (questionType === "mcm") {
            questionData = { description, options: options1, correctAnswer, type: 'MCM' };
        }
        if (questionType === "mtf") {
            questionData = { description, matches: pairs, type: 'Match the following' };
        }
        if (questionType === "tf") {
            options1 = ['True', 'False'];
            questionData = { description, options: options1, correctAnswer, type: 'True/False' };
        }
        if (questionType === "hotspot") {
            await uploadImage()
            if (image) {
                if (image_url == null) {
                    toast({ title: "Error", description: "Image upload failed", status: "error", duration: 9000, isClosable: true });
                    return;
                }
            }
            const ans = getBoxCoordinates();
            questionData = { description, correctAnswer: ans, type: 'Hotspot', imageUrl: image_url };
        }
        if (questionType === "reorder") {
            questionData = { description, options: sentences, type: 'Reorder' };
        }

        createQuestion(quizId, questionData).then((data) => {
            console.log(questionData);
            if (data?.message) {
                resetForm();
                toast({ title: "Success", description: data?.message, status: "success", duration: 9000, isClosable: true });
                router.push({ pathname: "/quiz_detail", query: { quizId: quizId } });
            } else {
                toast({ title: "Error", description: data?.error, status: "error", duration: 9000, isClosable: true });
            }
        }).finally(() => setLoading(false));
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
                  <Select
                    placeholder="Select the question type"
                    onChange={(e) => setQuestionType(e.target.value)}
                  >
                    <option value="mcq">
                      Multiple Choice Question (Single Correct)
                    </option>
                    <option value="mcm">
                      Multiple Choice Question (Multiple Correct)
                    </option>
                    <option value="tf">True/False</option>
                    <option value="mtf">Match The Following</option>
                    <option value="reorder">Reorder the Sentences</option>
                    <option value="fib">Fill in the blanks</option>
                    <option value="hotspot">Hotspot</option>
                  </Select>
                </FormControl>
                <FormControl id="description" as={GridItem} colSpan={6}>
                  <FormLabel>Question</FormLabel>
                  <Textarea
                    placeholder="Type Question here ..."
                    size="md"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </FormControl>
                {/* Multi choice single correct */}
                {questionType === "mcq" && (
                  <>
                    {options1.map((option, index) => (
                      <GridItem key={index} colSpan={[6, 3]}>
                        <Flex alignItems="center" mb={4}>
                          <Radio
                            mr={2}
                            isChecked={correctAnswer === option}
                            value={option}
                            onChange={(e) => setCorrectAnswer(e.target.value)}
                          />
                          <FormControl id={`option${index + 1}`}>
                            <FormLabel ml={2}>Option {index + 1}</FormLabel>
                            <Input
                              variant={"flushed"}
                              color={"gray.500"}
                              placeholder={`Option ${index + 1}`}
                              value={option}
                              onChange={(e) => handleOptionChange(index, e)}
                            />
                          </FormControl>
                        </Flex>
                      </GridItem>
                    ))}
                    <Button onClick={handleAddOption}>Add Option</Button>
                  </>
                )}
                {/* Multiple choice multi correct */}
                {questionType === "mcm" && (
                  <>
                    {options1.map((option, index) => (
                      <GridItem key={index} colSpan={[6, 3]}>
                        <Flex alignItems="center" mb={4}>
                          <Checkbox
                            mr={2}
                            isChecked={correctAnswer.includes(option)}
                            value={option}
                            onChange={(e) =>
                              setCorrectAnswer(
                                e.target.checked
                                  ? [...correctAnswer, e.target.value]
                                  : correctAnswer.filter(
                                      (ca) => ca !== e.target.value
                                    )
                              )
                            }
                          />
                          <FormControl id={`option${index + 1}`}>
                            <FormLabel ml={2}>Option {index + 1}</FormLabel>
                            <Input
                              variant={"flushed"}
                              color={"gray.500"}
                              placeholder={`Option ${index + 1}`}
                              value={option}
                              onChange={(e) => handleOptionChange(index, e)}
                            />
                          </FormControl>
                        </Flex>
                      </GridItem>
                    ))}
                    <Button onClick={handleAddOption}>Add Option</Button>
                  </>
                )}
                {/* True/False */}
                {questionType === "tf" && (
                  <FormControl id="correctAnswer" as={GridItem} colSpan={6}>
                    <FormLabel>Answer</FormLabel>
                    <Select
                      placeholder="Choose the answer"
                      onChange={(e) => setCorrectAnswer(e.target.value)}
                    >
                      <option value="True">True</option>
                      <option value="False">False</option>
                    </Select>
                  </FormControl>
                )}

                {/* Match the following */}
                {questionType === "mtf" && <>to be added</>}
                {/* reorder sentence */}
                {questionType === "reorder" && (
                  <>
                    {sentences.map((sentence, index) => (
                      <GridItem key={index} colSpan={[6, 3]}>
                        <FormControl id={`sentence${index + 1}`}>
                          <FormLabel>Sentence {index + 1}</FormLabel>
                          <Input
                            variant={"flushed"}
                            color={"gray.500"}
                            placeholder={`Sentence ${index + 1}`}
                            value={sentence}
                            onChange={(e) => handleSentenceChange(index, e)}
                          />
                        </FormControl>
                      </GridItem>
                    ))}
                    <Button onClick={handleAddSentence}>Add Sentence</Button>
                  </>
                )}
                {/* fill in the blanks */}
                {questionType === "fib" && <>to be added</>}
                {/* Hotspot type */}
                {questionType === "hotspot" && (
                  <>
                    <FormControl id="questionImage" as={GridItem} colSpan={6}>
                      <FormLabel fontSize="lg" mb={2}>
                        Upload Image
                      </FormLabel>
                      <Input type="file" onChange={handleFileChange} />
                      <Box position={"relative"} mt={4}>
                        <p mb={2} fontSize="sm" color="gray.500">
                          Uploaded Image:
                        </p>

                        {image ? (
                          <>
                            <Image
                              boxSize="200px"
                              src={
                                imageUrl ? imageUrl : URL.createObjectURL(image)
                              }
                              onMouseDown={startDraw}
                              onMouseMove={draw}
                              onMouseUp={endDraw}
                              onDragStart={(event) => event.preventDefault()}
                              alt="Hotspot"
                              style={{
                                position: "relative",
                                display: "inline-block",
                                overflow: "hidden",
                                width: "200%",
                                height: "200%",
                              }}
                            />
                            <Box
                              style={{
                                position: "absolute",
                                top: marker.top + "px",
                                left: marker.left + "px",
                                width: marker.width + "px",
                                height: marker.height + "px",
                                border: "2px solid red",
                                boxSizing: "border-box",
                                pointerEvents: "none",
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
                <Button
                  bg="#00237c"
                  color={"white"}
                  leftIcon={<FiEdit3 />}
                  loadingText={"Saving"}
                  isLoading={loading}
                  _hover={{ bg: "blue.500" }}
                  onClick={clickSubmit}
                >
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