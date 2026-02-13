import bcrypt from "bcryptjs"
import { prisma } from "../prisma"
import { Users, Role, UserStatus } from "../types/users"
export const createNewSalesman = async (data: Users) => {
    if (data.labels.length != 3) return { status: "error", message: "Labels must be 3" }
    try {
        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: await bcrypt.hash(data.password, 10),
                role: data.role as Role,
                status: data.status as UserStatus,
                labels: data.labels,
            },
        });
        return { status: "success", message: "User created successfully" }
    } catch (error) {
        console.log(error)
        return { status: "error", message: "User creation failed" }
    }

}