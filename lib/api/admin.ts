"use server"

import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { randomBytes } from "crypto"

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Role } from "@/generated/prisma/enums"

export async function getSalesmen() {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" }
    }

    try {
        const salesmen = await prisma.user.findMany({
            where: {
                role: "SALES",
            },
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                status: true,
                _count: {
                    select: { leads: true },
                },
            },
        })

        return { success: true, data: salesmen }
    } catch (error) {
        console.error("Error fetching salesmen:", error)
        return { error: "Failed to fetch salesmen" }
    }
}

export async function createSalesman(data: { name: string; email: string; mobile?: string }) {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" }
    }

    try {
        // Generate random password
        const password = randomBytes(4).toString("hex") // 8 characters
        const hashedPassword = await hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: "SALES",
                status: "ACTIVE",
            },
        })

        return {
            success: true,
            data: {
                ...user,
                element: { password }, // Return raw password only once
            },
        }
    } catch (error: any) {
        console.error("Error creating salesman:", error)
        if (error.code === "P2002") {
            return { error: "Email already exists" }
        }
        return { error: "Failed to create salesman" }
    }
}

export const fetchUserDetail = async (userId: string) => {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" }
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        })
        return { success: true, data: user }
    } catch (error) {
        console.error("Error fetching user leads:", error)
        return { error: "Failed to fetch user leads" }
    }
}

export const listUserLeads = async (userId: string) => {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" }
    }

    try {
        const leads = await prisma.lead.findMany({
            where: {
                createdById: userId,
            },
        })
        return { success: true, data: leads }
    } catch (error) {
        console.error("Error fetching user leads:", error)
        return { error: "Failed to fetch user leads" }
    }
}

export const disableUser = async (userId: string) => {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" }
    }

    try {
        const user = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                status: "DISABLED",
            },
        })
        return { success: true, data: user }
    } catch (error) {
        console.error("Error disabling user:", error)
        return { error: "Failed to disable user" }
    }
}

export const enableUser = async (userId: string) => {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" }
    }

    try {
        const user = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                status: "ACTIVE",
            },
        })
        return { success: true, data: user }
    } catch (error) {
        console.error("Error enabling user:", error)
        return { error: "Failed to enable user" }
    }
}

export const deleteUser = async (userId: string) => {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" }
    }

    try {
        const user = await prisma.user.delete({
            where: {
                id: userId,
            },
        })
        return { success: true, data: user }
    } catch (error) {
        console.error("Error deleting user:", error)
        return { error: "Failed to delete user" }
    }
}

export const resetPassword = async (userId: string) => {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" }
    }

    try {
        const password = randomBytes(4).toString("hex") // 8 characters
        const hashedPassword = await hash(password, 10)

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        })

        return { success: true, data: { password } }
    } catch (error) {
        console.error("Error resetting password:", error)
        return { error: "Failed to reset password" }
    }
}


