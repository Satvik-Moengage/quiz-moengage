import {
  Box,
  useColorModeValue,
  SimpleGrid,
  Button,
  Image,
  chakra,
  Stack,
} from "@chakra-ui/react";
import { FaUserCog } from "react-icons/fa";
import { RiLoginCircleLine } from "react-icons/ri";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Home() {
  const router = useRouter();

  return (
    <Box mx="auto" h={"100vh"} bg={"#1a202c"}>
      <Head>
        <title>Quiz Platform | Home</title>
      </Head>
      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        spacing={0}
        _after={{
          opacity: 0.25,
          pos: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          zIndex: -1,
          content: '" "',
        }}
        bg={"#1a202c"}
      >
        <Box>
          <Image
            //src="https://static.vecteezy.com/system/resources/previews/001/993/315/original/online-test-and-exam-with-people-filling-answer-vector.jpg"
            src="https://cdn-clalk.nitrocdn.com/KqmKVeLhgFAzHWrUbBzmAbRgoFMrOqoq/assets/images/optimized/rev-b569cbb/www.moengage.com/wp-content/uploads/3.-Carousel-of-leadership-quotes_Yashwanth-K-_Yashwanth-K--768x768.png"
            //src="https://martechseries.com/wp-content/uploads/2022/03/Forbes-Names-MoEngage-One-of-Americas-Best-Startup-Employers.jpg"
            alt="quiz"
            fit="cover"
            h={"99vh"}
            bg="gray.100"
            loading="lazy"
          />
        </Box>
        <Box
          textAlign="center"
          w={{ base: "full", md: 11 / 12, xl: 8 / 12 }}
          m="auto"
        >
          <chakra.h1
            fontSize={{ base: "4xl", sm: "5xl", md: "6xl" }}
            letterSpacing="tight"
            lineHeight="short"
            fontWeight="extrabold"
            color={useColorModeValue("gray.900", "white")}
          >
            <chakra.span
              display={{ base: "block", xl: "inline" }}
              color={"#cbceeb"}
            >
              <Image
                src="/moe-bluelogo.png"
                alt="Header Image"
                filter="brightness(25)"
              />
              Quiz Platform{" "}
            </chakra.span>
          </chakra.h1>
          <chakra.p
            mt={{ base: 3, sm: 5, md: 5 }}
            mx={{ sm: "auto", lg: 0 }}
            mb={6}
            fontSize={{ base: "lg", md: "xl" }}
            color="gray.500"
            lineHeight="base"
          >
            Practise and set up quizzes in our Quiz Platform.
          </chakra.p>
          <Stack
            direction={{
              base: "column",
              sm: "column",
              md: "row",
            }}
            mb={{ base: 4, md: 8 }}
            spacing={{ base: 4, md: 2 }}
            justifyContent="center"
          >
            <Button
              colorScheme="teal"
              size="lg"
              leftIcon={<FaUserCog />}
              onClick={() => router.replace("/register")}
            >
              Register
            </Button>
            <Button
              bg="white"
              color={"gray.900"}
              size="lg"
              leftIcon={<RiLoginCircleLine />}
              onClick={() => router.replace("/login")}
            >
              Login
            </Button>
          </Stack>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
