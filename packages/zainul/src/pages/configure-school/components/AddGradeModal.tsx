import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Stack,
    FormErrorMessage,
} from "@chakra-ui/react";
import React from "react";
import { Field, Form, Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import useTitumirMutation from "hooks/useTitumirMutation";
import { useAuthStore } from "state/authorization-store";
import { GradeBody } from "services/api/titumir";
import { GradeSchema } from "@veschool/types";
import { MutationContextKey, QueryContextKey } from "configs/enums";
import { useQueryClient } from "react-query";
import TextField from "components/TextField/TextField";
import QueryUser from "components/QueryUser/QueryUser";
import { FC } from "react";

/* TODO: instead of creating multiple grades at once, make the titumir
         able to create one grade with grade-moderator & grade-examiner & 
         grade-subjects. That makes these three field non-nullable

         From now on, grade must've grade moderator, examiner & subjects from the very beginning
 */

export interface GradeCreationFormSchema {
    standard: number;
    moderator: string;
    examiner: string;
}

export interface AddGradeModalProps {
    grades?: number[];
}

const AddGradeModal: FC<AddGradeModalProps> = ({ grades }) => {
    const user = useAuthStore((s) => s.user);
    const { isOpen, onClose, onToggle } = useDisclosure();

    const queryClient = useQueryClient();

    const {
        mutate: createGrade,
        isLoading,
        error,
    } = useTitumirMutation<GradeSchema, GradeBody>(
        MutationContextKey.CREATE_GRADES,
        (api, body) =>
            api.createGrade(user!.school!.short_name, body).then(({ json }) => json),
        {
            onSuccess(data) {
                queryClient.setQueryData<GradeSchema[]>(
                    QueryContextKey.GRADES,
                    (previous) => [...(previous ?? []), data],
                );
            },
        },
    );

    function handleClose() {
        onClose();
    }

    function handleSubmission(
        values: GradeCreationFormSchema,
        { resetForm, setSubmitting }: FormikHelpers<GradeCreationFormSchema>,
    ) {
        createGrade(values, {
            onSuccess() {
                resetForm();
            },
            onError() {
                setSubmitting(false);
            },
        });
    }

    const GradeBodySchema = yup.object().shape({
        standard: yup.number().max(50).min(1).required(),
        moderator: yup.string().email().required(),
        examiner: yup.string().email().required(),
    });

    return (
        <>
            <Button variant="ghost" onClick={onToggle}>
                Add Grades
            </Button>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered
                size="4xl"
                closeOnEsc={false}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Grade</ModalHeader>
                    <Formik
                        initialValues={{
                            standard: Math.max(...(grades ? grades : [0])) + 1,
                            moderator: "",
                            examiner: "",
                        }}
                        onSubmit={handleSubmission}
                        validationSchema={GradeBodySchema}
                    >
                        <Form>
                            <ModalCloseButton />
                            <ModalBody>
                                <Stack spacing="4" direction={["column", null, "row"]}>
                                    <Field
                                        component={TextField}
                                        name="standard"
                                        type="number"
                                        placeholder="Grade No."
                                        max={50}
                                        min={1}
                                    />
                                    <Field
                                        component={QueryUser}
                                        name="moderator"
                                        placeholder="Moderator's Email"
                                        required
                                    />
                                    <Field
                                        component={QueryUser}
                                        name="examiner"
                                        placeholder="Examiner's Email"
                                        required
                                    />
                                </Stack>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    onClick={handleClose}
                                    colorScheme="gray"
                                    variant="ghost"
                                >
                                    Cancel
                                </Button>
                                <Button isLoading={isLoading} type="submit">
                                    Create
                                </Button>
                            </ModalFooter>
                            <FormErrorMessage>{error && error.message}</FormErrorMessage>
                        </Form>
                    </Formik>
                </ModalContent>
            </Modal>
        </>
    );
};

export default AddGradeModal;
