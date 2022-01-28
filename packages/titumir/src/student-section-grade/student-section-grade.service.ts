import {
    BadRequestException,
    forwardRef,
    Inject,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import BasicEntityService from "../database/abstracts/entity-service.abstract";
import Grade from "../database/entity/grades.entity";
import School from "../database/entity/schools.entity";
import Section from "../database/entity/sections.entity";
import StudentsToSectionsToGrades from "../database/entity/students_sections_grades.entity";
import User from "../database/entity/users.entity";
import { USER_ROLE } from "@schoolacious/types";
import { UserService } from "../user/user.service";

@Injectable()
export class StudentSectionGradeService extends BasicEntityService<StudentsToSectionsToGrades> {
    constructor(
        @InjectRepository(StudentsToSectionsToGrades)
        private ssgRepo: Repository<StudentsToSectionsToGrades>,
        @Inject(forwardRef(() => UserService)) private userService: UserService,
    ) {
        super(ssgRepo);
    }

    async addStudents(
        user_ids: string[],
        school: School,
        grade: Grade,
        section: Section,
    ) {
        const users = await this.userService.find(
            { _id: In(user_ids) },
            { relations: ["school"] },
        );

        const invalidUsers = [];
        const validUserPayload = [];

        for (const user of users) {
            if (user.school?._id !== school._id)
                invalidUsers.push(`${user._id} doesn't belong to the school`);
            // only students can be added as a student to any other section-grade
            else if (user.role !== USER_ROLE.student)
                invalidUsers.push(
                    `${user._id} is a ${user.role?.valueOf()}, can't add as a student`,
                );
            else {
                validUserPayload.push({ user, grade, section });
            }
        }
        const createdUsers = await this.create(validUserPayload);
        return { users: createdUsers, error: invalidUsers };
    }

    async removeStudent(user: string | User) {
        if (typeof user === "string")
            user = await this.userService.findOne({ _id: user });
        // only students
        if (user.role !== USER_ROLE.student)
            throw new BadRequestException("user isn't a student");
        // ssg = Student Section Grade
        const ssg = await this.findOne({ user });
        delete (ssg as any).assigned_at;
        const deleteResult = await this.ssgRepo.delete(ssg);
        if (deleteResult.affected !== 1)
            throw new InternalServerErrorException("failed removing student");
        return { message: "successfully removed student" };
    }
}