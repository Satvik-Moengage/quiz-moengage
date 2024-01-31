import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Heading,
  IconButton,
  Flex,
  Box,
  Icon,
  Tooltip,
  HStack,
  Stack,
  Text,
  Image
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { GrAdd } from 'react-icons/gr';
import { CgTrash } from 'react-icons/cg';
import { FiChevronRight, FiChevronDown } from 'react-icons/fi';
import { IoDiscOutline } from 'react-icons/io5';
import Card from '../Card';
import { useEffect, useState } from 'react';

const fetcher = (url) => axios.get(url).then((res) => res.data);

const validateUser = (currentUserId, authorUserId) =>
  String(currentUserId) !== String(authorUserId);

const Questions = ({ quiz }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [questions, setQuestions] = useState(quiz?.questions)

  useEffect(() => {
    setQuestions(quiz?.questions);
    quiz?.questions.forEach(question => {
      if(question.type ==='Hotspot'){
        console.log(question)
      }
    });
  }, [quiz?.questions]);

  const handleDelete = async (questionId) => {
    await axios.delete(`/api/question/updating/${questionId}`);
    setQuestions(questions.filter((question) => question._id !== questionId));
  };

  const handleUpdate = async (updatedQuestion) => {
    await axios.put(`/api/question/updating/${updatedQuestion._id}`, updatedQuestion);
    setQuestions(
      questions.map((question) =>
        question._id === updatedQuestion._id ? updatedQuestion : question
      )
    );
  };

  return (
    <Card>
      <Flex justify={'space-between'} mb={3}>
        <Heading>Questions</Heading>
        <Tooltip label={'Add Question'} hasArrow placement={'top'} bg={'teal'}>
          <IconButton
            size={'md'}
            aria-label={'type'}
            icon={<GrAdd />}
            isRound
            bg={'gray.300'}
            onClick={() =>
              router.push({
                pathname: '/create_question',
                query: { quizId: quiz?.id }
              }, '/create_question')
            }
            disabled={validateUser(session?.user?.id, quiz?.authorId)}
          />
        </Tooltip>
      </Flex>
      <Accordion allowToggle>
        {questions?.length === 0 ? (
          <Text>No questions have been created yet.</Text>
        ) : (
          <>
            {questions?.map((question) => (
              <QuestionItem
                key={question?._id}
                question={question}
                isBtnDisabled={validateUser(
                  session?.user?.id?.toString(),
                  quiz?.authorId
                )}
                handleDelete={handleDelete}
                handleUpdate={handleUpdate}
              />
            ))}
          </>
        )}
      </Accordion>
    </Card>
  );
};

const QuestionItem = ({ question, isBtnDisabled, handleDelete, handleUpdate }) => {
  // const handleDelete = async () => {
  //   await axios.delete(`/api/question/updating/${question?._id}`);
  // };

  // const handleUpdate = async () => {
  //   await axios.put(`/api/question/updating/${question?._id}`, question);
  // };

  const onHandleDelete = () => {
    handleDelete(question._id);
  };

  const onHandleUpdate = () => {
    handleUpdate(question);
  };

  return (
    <AccordionItem my={3}>
      {({ isExpanded }) => (
        <>
          <Heading as="h3" size={'sm'}>
            <AccordionButton>
              <Icon
                as={isExpanded ? FiChevronDown : FiChevronRight}
                w={6}
                h={6}
              />
              <Box
                flex="1"
                textAlign="left"
                fontFamily={'Poppins'}
              >
                {question?.description}
              </Box>
              <HStack spacing={4}>
                <Tooltip
                  label={"Remove Question"}
                  hasArrow
                  placement={"right"}
                  bg={"teal"}
                >
                  <IconButton
                    size={'sm'}
                    aria-label={'remove'}
                    icon={<CgTrash />}
                    isRound
                    disabled={isBtnDisabled}
                    bg={"gray.300"}
                    onClick={onHandleDelete}
                  />
                </Tooltip>
              </HStack>
            </AccordionButton>
          </Heading>
          {/* h */}
          {['MCQ', 'MCM', 'True/False'].includes(question?.type) && (
            <AccordionPanel pb={4}>
              {question?.options?.map((opt, i) => (
                <OptionItem
                  key={i}
                  color={
                    question?.correctAnswer.includes(opt)
                      ? 'green'
                      : 'gray.800'
                  }
                  text={opt}
                />
              ))}
            </AccordionPanel>
          )}
          {question?.type === 'Reorder' && (
            <AccordionPanel pb={4}>
              <p>Correct order</p>
              {question?.options?.map((opt, i) => (
                <OptionItem
                  key={i}
                  color={
                    question?.options.includes(opt)
                      ? 'green'
                      : 'gray.800'
                  }
                  text={opt}
                />
              ))}
            </AccordionPanel>
          )}
          {question?.type === 'Hotspot' && (
            <AccordionPanel pb={4}>
              <p>Marked Area</p>
              <div style={{ position: 'relative' }}>
                <Image src={question?.imageUrl} style={{ width: '750px', height: '500px' }} />
                <div
                  style={{
                    position: 'absolute',
                    top: `${question.correctAnswer.top}px`,
                    left: `${question.correctAnswer.left}px`,
                    width: `${question.correctAnswer.width}px`,
                    height: `${question.correctAnswer.height}px`,
                    border: '2px solid red',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </AccordionPanel>
          )}
          {question?.type === 'Fill' && (
            <AccordionPanel pb={4}>
              {question.dropdowns.map((dropdown, index) => (
                <Box key={index}>
                  <Text display="inline">Blank {index + 1} : </Text>
                  <Text display="inline" color="green">{dropdown.correctAnswer}</Text>
                </Box>
              ))}
            </AccordionPanel>
          )}
        </>
      )}
    </AccordionItem>
  );
};

const OptionItem = ({ color, text }) => (
  <Stack spacing={4} direction={'row'} alignItems={'center'}>
    <Icon as={IoDiscOutline} w={4} h={4} color={color} />
    <Text color={color}>{text}</Text>
  </Stack>
);

export default Questions;