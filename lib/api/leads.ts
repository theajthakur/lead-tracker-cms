"use server"
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma"
import Lead, { UpdateLeadFollowUpStage } from "@/lib/types/leads"
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export const createNewLead = async (data: Lead) => {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    console.log(session)
    if (!userId) return { status: "error", message: "User not found" }
    try {
        const lead = await prisma.lead.create({
            data: {
                name: data.name,
                email: data.email,
                mobile: data.mobile,
                description: data.description,
                source: data.source,
                followUpStage: data.followUpStage,
                createdById: userId,
            },
        });
        revalidatePath("/leads")
        return { status: "success", message: "Lead created successfully", data: lead }
    } catch (error) {
        console.log(error)
        return { status: "error", message: "Lead creation failed" }
    }
}

export const updateLeadFollowUpStage = async (data: UpdateLeadFollowUpStage) => {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) return { status: "error", message: "User not found" }
    try {
        const lead = await prisma.lead.update({
            where: {
                id: data.id,
                createdById: userId,
            },
            data: {
                followUpStage: data.followUpStage,
            },
        });
        revalidatePath("/leads")
        return { status: "success", message: "Lead updated successfully" }
    } catch (error) {
        console.log(error)
        return { status: "error", message: "Lead update failed" }
    }
}

export const getAllLeads = async () => {
    try {
        const leads = await prisma.lead.findMany();
        return { status: "success", data: leads }
    } catch (error) {
        console.log(error)
        return { status: "error", message: "Failed to fetch leads" }
    }
}

export const getLeadById = async (id: string) => {
    try {
        const lead = await prisma.lead.findUnique({
            where: {
                id: id,
            },
        });
        return { status: "success", data: lead }
    } catch (error) {
        console.log(error)
        return { status: "error", message: "Failed to fetch lead" }
    }
}

export const getLeadsByUserId = async (userId: string) => {
    try {
        const leads = await prisma.lead.findMany({
            where: {
                createdById: userId,
            },
        });
        return { status: "success", data: leads }
    } catch (error) {
        console.log(error)
        return { status: "error", message: "Failed to fetch leads" }
    }
}
