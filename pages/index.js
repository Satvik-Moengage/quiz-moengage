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
    <Box
      mx="auto"
      h="100vh"
      bg="#1a202c"
      display="flex"
      justifyContent="center"
    >
      <Head>
        <title>Quiz Platform | Home</title>
      </Head>
      <SimpleGrid
        columns={{ base: 1, md: 1 }} // Set to 1 column for all sizes
        spacing={0}
        w={{ base: "full", md: "50%" }} // Set the width to be full on base and 50% on medium screens
        minChildWidth="320px" // Make sure the grid never gets too small for the content
        placeItems="center" // Center items both horizontally and vertically in the grid cell
        bg="#1a202c"
      >
      
        <Box textAlign="center" w={{ base: "full", md: 11 / 12, xl: 8 / 12 }}>
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
