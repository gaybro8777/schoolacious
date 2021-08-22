import {
    Heading,
    List,
    ListItem,
    Stack,
    Link as CLink,
    Text,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    HStack,
    InputGroup,
    InputLeftElement,
    Input,
} from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import Paper from "components/Paper/Paper";
import { INVITATION_OR_JOIN_ROLE } from "services/api/titumir";
import InviteMembersDrawer from "./components/InviteMembersDrawer";
import ListAvatarTile from "components/ListAvatarTile/ListAvatarTile";
import useTitumirQuery from "hooks/useTitumirQuery";
import { QueryContextKey } from "configs/enums";
import { useAuthStore } from "state/authorization-store";
import { UserSchema } from "@veschool/types";
import { FaEllipsisH, FaSearch } from "react-icons/fa";

function AddRemoveMembers() {
    const school = useAuthStore((s) => s.user?.school);

    const { data: members } = useTitumirQuery<UserSchema[]>(
        QueryContextKey.SCHOOL_MEMBERS,
        (api) => api.getAllSchoolMembers(school!.short_name).then(({ json }) => json),
    );

    const memberOptions = (
        <Menu>
            <MenuButton as={IconButton} variant="ghost" icon={<FaEllipsisH />} />

            <MenuList>
                <MenuItem>Remove</MenuItem>
                <MenuItem>Modify</MenuItem>
            </MenuList>
        </Menu>
    );

    return (
        <Stack direction="column" spacing="2" p="2" wrap="wrap">
            <Paper
                maxW={["full", null, "xl"]}
                shadow="none"
                colorScheme="tinted"
                py="2"
                m="0"
                alignSelf="center"
            >
                <Heading size="md">Configure Members</Heading>
                <List>
                    <ListItem>
                        <InviteMembersDrawer role={INVITATION_OR_JOIN_ROLE.teacher} />
                    </ListItem>
                    <ListItem>
                        <InviteMembersDrawer role={INVITATION_OR_JOIN_ROLE.student} />
                    </ListItem>
                    <ListItem>
                        <CLink color="primary.400" as={Link} to="/school/invitations">
                            View Sent Invitations
                        </CLink>
                    </ListItem>
                </List>
            </Paper>
            <HStack justify="space-between">
                <Heading size="md">Members</Heading>
                <InputGroup maxW="xs">
                    <InputLeftElement>
                        <FaSearch />
                    </InputLeftElement>
                    <Input
                        type="search"
                        name="search"
                        placeholder="Search Members"
                        required
                    />
                </InputGroup>
            </HStack>
            <List>
                {members?.map(({ _id, first_name, last_name, role }, i) => (
                    <ListAvatarTile
                        key={_id + i}
                        to={`/user/profile/${_id}`}
                        name={[first_name, last_name]}
                        ending={memberOptions}
                    >
                        <Text color="gray">[{role?.valueOf()}]</Text>
                    </ListAvatarTile>
                ))}
            </List>
        </Stack>
    );
}

export default AddRemoveMembers;
