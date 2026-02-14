import { getSalesmen } from "@/lib/api/admin"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import SalesmanView from "@/components/salesman/SalesmanView"

export default async function SalesmanPage() {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
        redirect("/")
    }

    const { data: salesmen, error } = await getSalesmen()

    if (error) {
        // Handle error gracefully or show toast in client component
        console.error(error)
    }

    return <SalesmanView initialSalesmen={salesmen || []} />
}
