import { Flex, Checkbox } from "@chakra-ui/react";

const User = ({ user, onUserSelect }) => {  
    return (
      <Flex>
        <Checkbox onChange={(e) => onUserSelect(user, e.target.checked)}>{user.name}</Checkbox>
      </Flex>
    )
};

export default User;