import { Box, Button, Checkbox, Flex, Heading, Text } from "@chakra-ui/react";
import Card from "../Card";
import Layout from "../Layout";
import { useState } from "react";
import useSWR from "swr";
import axios from "axios";

const fetcher = (url) => axios.get(url, fetcher).then((resp) => resp.data);

export default function Users() {
    const { data: users } = useSWR("/api/user", fetcher);
    const [selectedUserIDs, setSelectedUserIDs] = useState([]);
    const nonAdminUsers = users?.filter(user => !user.isAdmin);

    const handleCheckBoxChange = (event, userId) => {
        if(event.target.checked) {
            setSelectedUserIDs([...selectedUserIDs, userId]);
        } else {
            setSelectedUserIDs(selectedUserIDs.filter(id => id !== userId));
        }
    }

    console.log(selectedUserIDs)
    
    return (
        <Box px={8} style={{ fontFamily: "Poppins" }}>
            <Card>
                <Heading>Enroll Users</Heading>
                {nonAdminUsers?.map((user) => (
                    <UserItem key={user?._id} user={user} onCheckboxChange={handleCheckBoxChange} isSelected={selectedUserIDs.includes(user._id)}/>
                ))}
            </Card>
        </Box>
    );
}

const UserItem = ({ user, onCheckboxChange, isSelected }) => {
    return (
        <Box mb={6}>
            <Flex alignItems={"center"} justifyContent={"space-between"}>
                <Flex alignItems={"center"}>
                    <Checkbox isChecked={isSelected} onChange={(e) => onCheckboxChange(e, user._id)} mr={5}/>
                    <Flex
                        alignItems={"flex-start"}
                        justifyContent={"space-between"}
                        flexDirection={"column"}
                    >
                        <Text fontSize={"xl"}>{user?.name}</Text>
                        <Text fontSize={"md"} color={"gray.500"}>
                            {user?.email}
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
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

Users.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};