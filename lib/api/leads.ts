"use server"
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma"
import Lead, { UpdateLeadFollowUpStage } from "@/lib/types/leads"
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export const createNewLead = async (data: Lead) => {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) return { status: "error", message: "User not found" }
    try {
        const lead = await prisma.lead.create({
            data: {
                name: data.name,
                email: data.email,
                mobile: data.mobile,
                description: data.description,
                source: data.source,
                label: data.label,
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
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) return { status: "error", message: "User not found" }
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
        return { status: "success", data: leads, error: null }
    } catch (error) {
        console.log(error)
        return { status: "error", message: "Failed to fetch leads" }
    }
}

export const deleteLead = async (id: string) => {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) return { status: "error", message: "User not found" }
    try {
        const lead = await prisma.lead.delete({
            where: {
                id: id,
                createdById: userId,
            },
        });
        revalidatePath("/leads")
        return { status: "success", message: "Lead deleted successfully" }
    } catch (error) {
        console.log(error)
        return { status: "error", message: "Lead deletion failed" }
    }
}

export const updateLeadContent = async (data: Lead) => {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) return { status: "error", message: "User not found" }
    if (!data.id) return { status: "error", message: "Lead ID is required" }
    try {
        const lead = await prisma.lead.update({
            where: {
                id: data.id,
                createdById: userId,
            },
            data: {
                name: data.name,
                email: data.email,
                mobile: data.mobile,
                description: data.description,
                source: data.source,
                label: data.label,
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

export const leadsAnalytics = async () => {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) return { status: "error", message: "User not found" }
    return getLeadsAnalyticsByUserId(userId);
}

export const getLeadsAnalyticsByUserId = async (userId: string) => {
    try {
        const result = await prisma.lead.groupBy({
            by: ["followUpStage"],
            _count: {
                followUpStage: true,
            },
            where: { createdById: userId },
        });
        const stats = {
            totalLeads: 0,
            stage1: 0,
            stage2: 0,
            stage3: 0,
            stage4: 0,
            stage5: 0,
            stage6: 0,
        };

        result.forEach(item => {
            stats.totalLeads += item._count.followUpStage;

            if (item.followUpStage === 1) stats.stage1 = item._count.followUpStage;
            if (item.followUpStage === 2) stats.stage2 = item._count.followUpStage;
            if (item.followUpStage === 3) stats.stage3 = item._count.followUpStage;
            if (item.followUpStage === 4) stats.stage4 = item._count.followUpStage;
            if (item.followUpStage === 5) stats.stage5 = item._count.followUpStage;
            if (item.followUpStage === 6) stats.stage6 = item._count.followUpStage;
        });

        return { status: "success", data: stats }
    } catch (error) {
        console.log(error)
        return { status: "error", message: "Failed to fetch leads analytics" }
    }
}

export const updateLeadLabels = async (data: { label: string }[]) => {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) return { status: "error", message: "User not found" }

    if (!Array.isArray(data) || data.length !== 3) {
        return { status: "error", message: "Exactly 3 labels are required" }
    }

    try {
        const labels = data.map(d => d.label);
        await prisma.user.update({
            where: { id: userId },
            data: { labels },
        });
        revalidatePath("/leads")
        return { status: "success", message: "Labels updated successfully" }
    } catch (error) {
        console.log(error)
        return { status: "error", message: "Failed to update labels" }
    }
}

export const getRecentLeadsActivity = async () => {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) return { status: "error", message: "User not found" }

    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 6); // Last 7 days including today

        const leads = await prisma.lead.findMany({
            where: {
                createdById: userId,
                createdAt: {
                    gte: startDate,
                },
            },
            select: {
                createdAt: true,
                followUpStage: true,
            },
        });

        // Initialize last 7 days with 0 counts
        const activityMap = new Map<string, { date: string, total: number, stage1: number, stage2: number, stage3: number }>();

        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const dateString = date.toLocaleDateString('en-US', { weekday: 'short' }); // e.g., "Mon"
            // Use ISO string key for sorting/matching but display format for UI
            const key = date.toISOString().split('T')[0];
            activityMap.set(key, { date: dateString, total: 0, stage1: 0, stage2: 0, stage3: 0 });
        }

        leads.forEach(lead => {
            const key = lead.createdAt.toISOString().split('T')[0];
            if (activityMap.has(key)) {
                const entry = activityMap.get(key)!;
                entry.total += 1;
                if (lead.followUpStage === 1) entry.stage1 += 1;
                if (lead.followUpStage === 2) entry.stage2 += 1;
                if (lead.followUpStage === 3) entry.stage3 += 1;
            }
        });

        const data = Array.from(activityMap.values());
        return { status: "success", data }
    } catch (error) {
        console.log(error)
        return { status: "error", message: "Failed to fetch activity" }
    }
}