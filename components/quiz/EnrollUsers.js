import {
    Box,
    Heading,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from "@chakra-ui/react";
import Card from "../Card";
import useSWR from "swr";
import axios from "axios";
import { useState } from "react";
import User from "./User";


const fetcher = (url) => axios.get(url).then((resp) => resp.data);


export default function EnrollUsers({ quiz, isOpen, onClose }) {
    const { data: users } = useSWR("/api/user", fetcher);
    const quizId = quiz?.id
    console.log(quizId);

    const [selectedUsers, setSelectedUsers] = useState([]);

    const onUserSelect = (user, isChecked) => {
        if (isChecked) {
            setSelectedUsers([...selectedUsers, user._id]);
        } else {
            setSelectedUsers(selectedUsers.filter(id => id !== user._id));
        }
    };

    const onSubmit = async () => {
        try {
            const response = await axios.post(`/api/quiz/enroll/${quizId}`, {
              usersEnrolled: selectedUsers
            });
        
            console.log(response.data.message);
        
            onClose();
          } catch (error) {
            console.log(error);
          }
      };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                <ModalBody>
                    <Box px={8} style={{ fontFamily: "Poppins" }}>
                        <Heading py={5}>Enroll Users</Heading>
                        <Card>
                            {
                                users?.map((user) =>
                                    user?.isAdmin ? null : <User key={user?._id} user={user} onUserSelect={onUserSelect} />
                                )
                            }
                        </Card>
                    </Box>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onClose}>Close</Button>
                    {/* Add the Submit Button */}
                    <Button colorScheme="blue" onClick={onSubmit}>Submit</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}