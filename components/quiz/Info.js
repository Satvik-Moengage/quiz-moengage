import { Heading, Flex, Box, Text, SimpleGrid, Button, useDisclosure } from "@chakra-ui/react";
import Card from "../Card";
import EnrollUsers from "../quiz/EnrollUsers"; 
import { useRouter } from "next/router";

const Info = ({ quiz }) => {
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
      <Card>
        <Flex alignItems={"center"}>
          <Heading>{quiz?.title}</Heading>
        </Flex>
        <Box mt={2}>
          <SimpleGrid columns={{ base: 4, md: 2, lg: 2 }} spacing={"20px"}>
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
                Quiz Description
              </Text>
              <Text color={"gray.900"} fontSize={"md"}>
                {quiz?.description}
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
                {new Date(
                  quiz?.scheduledFor?.replace("Z", "")
                ).toLocaleString()}
              </Text>
              <br />
              <Text
                color={"gray.400"}
                fontWeight={600}
                fontSize="sm"
                textTransform={"uppercase"}
              >
                Quiz Ends At
              </Text>
              <Text color={"gray.900"} fontSize={"md"}>
                {new Date(quiz?.endTime?.replace("Z", "")).toLocaleString()}
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
              bg="#00237c"
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
            >
              View Submissions
            </Button>
            <Button
              onClick={onOpen}
              bg="#00237c"
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
            >
              Enroll Users
            </Button>
            <EnrollUsers quiz={quiz} isOpen={isOpen} onClose={onClose} />
          </SimpleGrid>
          <Box mx={2} my={5}></Box>
        </Box>
      </Card>
    );
};

export default Info;