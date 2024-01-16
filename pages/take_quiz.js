/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import {
    Box,
    Flex,
    Heading,
    Stack,
    Button,
    Text,
    RadioGroup,
    Radio,
    useColorModeValue,
    useToast,
    Checkbox,
    CheckboxGroup
} from "@chakra-ui/react";
import { Icon } from '@chakra-ui/react';
import Countdown from "../components/Countdown";
import Layout from "../components/Layout";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Loader from "../components/common/Loader";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import axios from "axios";
import useSWR from "swr";
import { submitQuiz, resetQuiz } from "../services/quiz";
import Head from "next/head"
import { Image } from "@chakra-ui/image";


const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function Quiz() {
    const { data: session } = useSession();
    const router = useRouter();
    const toast = useToast();
    const { quizId } = router.query;

    const [allQuestions, setAllQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [currentAns, setCurrentAns] = useState(allQuestions[currentQuestion]?.type === "MCM" ? [] : '');
    const [currentStep, setCurrentStep] = useState(1);
    const [allAns, setAllAns] = useState(null);
    const [loading, setLoading] = useState(true);
    const [totalDuration, setTotalDuration] = useState(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [marker, setMarker] = useState({ top: null, left: null });
    const [dragging, setDragging] = useState(false);

    const { data } = useSWR(`/api/quiz/student?quizId=${quizId}`, fetcher);

    /**
     * Handle next btn
     */
    const _next = () => {
        let currQues = currentQuestion + 1;
        setCurrentStep(currentStep + 1);
        setCurrentQuestion(currentQuestion + 1);
        setCurrentAns(allAns[currQues].selectedOption);
    };

    /**
     * Handle Prev Btn
     */

    const _prev = () => {
        let currQues = currentQuestion - 1;
        setCurrentStep(currentStep - 1);
        setCurrentQuestion(currentQuestion - 1);
        setCurrentAns(allAns[currQues].selectedOption);
    };
    // Prev Btn
    const prevBtn = () => {
        if (currentStep !== 1) {
            return <QuizBtn text={"Prev"} onClick={_prev} />;
        }
        return null;
    };

    // Next Btn
    const nextBtn = () => {
        if (currentStep < allQuestions.length) {
            return <QuizBtn text={"Next"} onClick={_next} />;
        } else if (currentStep === allQuestions.length) {
            return (
                <QuizBtn
                    text={"Finish"}
                    onClick={() => setShowConfirmModal(true)}
                />
            );
        }
    };

    // Save the answers on click next or prev

    const handleChange = (newValue) => {
        let newState = [...allAns];
        newState[currentQuestion].selectedOption = newValue;

        setAllAns(newState);
        setCurrentAns(newValue);
    };
    const handleMCMChange = (selectedValues) => {
        console.log(selectedValues); 
    
        const newState = [...allAns];
        newState[currentQuestion].selectedOption = selectedValues;
    
        setAllAns(newState);
        setCurrentAns(selectedValues);
    };
    /**
     * Submit the quiz to the backend
     */
    const clickSubmit = () => {
        let submitData = allAns.map(ans => {
            if (Array.isArray(ans.selectedOption)) {
                return { ...ans, selectedOption: ans.selectedOption.join(',') };
            }
            return ans;
        });

        submitQuiz(
            { quizId: quizId, userId: session?.user?.id },
            { questions: submitData }
        ).then((data) => {
            router.replace(
                { pathname: "/results", query: { attemptId: data.attemptId } },
                "/results"
            );
        });
    };

    /**
     * this method takes in the current quiz duration and returns the future end time for the quiz for the countdown component
     */

    function getTotalTime(duration) {
        let durationInMillSec = parseInt(duration) * 60 * 1000;
        let currentTime = new Date().getTime();
        let futureTime = currentTime + durationInMillSec;
        return futureTime;
    }

    /**
     * This methods takes an array of questions and duration and restructures questions in a form
     * for saving answers.
     * @param {*} questions
     * @param duration
     */

    const setupQuiz = (questions, duration) => {
        var questionsData = [];
        var answerData = [];
        var quizDuration = 0;

        if (questions?.length === 0) {
            return;
        }

        questions?.map((ques) => {
            let questObj
            if (ques.type === "MCQ") {
                questObj = {
                    text: ques?.description,
                    options: ques?.options,
                    type: ques?.type
                };
            }
            else if (ques.type === "True/False") {
                questObj = {
                    text: ques?.description,
                    options: ques?.options,
                    type: ques?.type
                };
            }

            else if (ques.type === "Hotspot") {
                questObj = {
                    text: ques?.description,
                    options: ques?.options,
                    imageUrl: ques?.imageUrl,
                    type: ques?.type
                };
            }
            else if (ques.type === "MCM") {
                questObj = {
                    text: ques?.description,
                    options: ques?.options,
                    type: ques?.type
                };
            }

            questionsData.push(questObj);
            let ansObj = {
                selectedOption: null,
            };

            answerData.push(ansObj);
        });
        quizDuration = getTotalTime(duration);

        setAllQuestions(questionsData);
        setAllAns(answerData);
        setTotalDuration(quizDuration);
        setLoading(false);
    };

    useEffect(() => {
        if (data) {
            setupQuiz(data.questions, data.duration);
        }
    }, [data]);

    /**
     * Method that resets the quiz and redirects the user
     */

    const onTimeUp = () => {
        resetQuiz();
        setShowResetModal(false);
        router.replace(`/quizzes`);
    };

    const startDraw = (event) => {
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setMarker({ top: y, left: x });
        setDragging(false);
    }
    const draw = () => {

    }
    const endDraw = () => {
        setDragging(false);
        getBoxCoordinates();
    }

    const getBoxCoordinates = () => {
        return marker
    }

    return (
        <Box fontFamily={"Poppins"}>
            <Head>
                <title>Quiz Platform | Take Quiz</title>
            </Head>
            <Flex
                justify={"center"}
                align={"flex-start"}
                bg={useColorModeValue("gray.50", "gray.800")}
                mt={2}
            >
                {loading ? (
                    <Loader />
                ) : (
                    <Stack spacing={8} mx={"auto"} w={"768px"}>
                        <Stack
                            align={"center"}
                            direction={"row"}
                            justify={"space-between"}
                        >
                            <Heading fontSize={"2xl"}>
                                Question {currentStep} out of{" "}
                                {allQuestions.length}
                            </Heading>
                            <Countdown
                                title={"Time Remaining"}
                                totalTime={totalDuration}
                                onComplete={() => setShowResetModal(true)}
                            />
                        </Stack>
                        <Box
                            rounded={"lg"}
                            bg={useColorModeValue("white", "gray.700")}
                            boxShadow={"lg"}
                            p={8}
                        >
                            <Text size={"md"} mb={3}>
                                {allQuestions[currentQuestion]?.text}
                            </Text>
                            {/* {allQuestions[currentQuestion]?.type === "Hotspot" && (
                            <>
                                <Box position="relative"> 
                                <Image
                                    boxSize="200px"
                                    src={allQuestions[currentQuestion]?.imageUrl}
                                    onMouseDown={startDraw}
                                    onMouseUp={endDraw}
                                    onDragStart={(event) => event.preventDefault()}
                                    alt="Hotspot"
                                    style={{display: 'block', width: '100%', height: 'auto'}}
                                />
                                {marker &&
                                    <Icon
                                        boxSize={5} 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                        fill="none" 
                                        style={{
                                            position: 'absolute',
                                            top: marker.top + 'px', 
                                            left: marker.left + 'px'
                                        }}
                                    >

                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </Icon>
                                }
                                </Box>
                            </>)} */}
                            {allQuestions[currentQuestion]?.type === "MCQ" && (
                                <RadioGroup onChange={handleChange} value={currentAns}>
                                    <Stack direction="column" spacing={4}>
                                        {allQuestions[currentQuestion]?.options.map((opt, i) => (
                                            <Radio value={opt} key={i}>{opt}</Radio>
                                        ))}
                                    </Stack>
                                </RadioGroup>
                            )}
                            {allQuestions[currentQuestion]?.type === "MCM" && (
                                <CheckboxGroup
                                value={currentAns || []} 
                                onChange={handleMCMChange}
                            >
                                <Stack direction="column" spacing={4}>
                                    {allQuestions[currentQuestion]?.options.map((opt, i) => (
                                        <Checkbox value={opt} key={i}>{opt}</Checkbox>
                                    ))}
                                </Stack>
                            </CheckboxGroup>
                            )}
                            {allQuestions[currentQuestion]?.type === "True/False" && (
                                <>
                                    <Text size={"md"} mb={3}>
                                        {allQuestions[currentQuestion]?.correctAnswer}
                                    </Text>

                                    <RadioGroup
                                        onChange={handleChange}
                                        value={currentAns}
                                    >
                                        <Stack spacing={4} direction={"column"}>
                                            {allQuestions[currentQuestion]?.options.map(
                                                (opt, i) => (
                                                    <Radio value={opt} key={opt}>
                                                        {opt}
                                                    </Radio>
                                                )
                                            )}
                                        </Stack>
                                    </RadioGroup>
                                </>)}

                            <Stack spacing={10} direction={"row"} mt={5}>
                                {prevBtn()}
                                {nextBtn()}
                            </Stack>
                        </Box>
                    </Stack>
                )}
            </Flex>
            {/* Dialog Box to confirm quiz submission */}
            <ConfirmDialog
                isOpen={showConfirmModal}
                onClose={setShowConfirmModal}
                title={"Submit Quiz"}
                description={`Confirm to submit quiz`}
                onClickConfirm={clickSubmit}
            />
            <ConfirmDialog
                isOpen={showResetModal}
                onClose={setShowResetModal}
                title={"Quiz timeout!"}
                description={`You time to do the quiz is up.`}
                onClickConfirm={onTimeUp}
                showNoBtn={false}
            />
        </Box>
    );
};

const QuizBtn = ({ text, onClick }) => (
    <Button
        bg={"blue.400"}
        onClick={onClick}
        color={"white"}
        _hover={{
            bg: "blue.500",
        }}
    >
        {text}
    </Button>
);

Quiz.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}