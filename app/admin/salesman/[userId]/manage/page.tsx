import { fetchUserDetail } from "@/lib/api/admin";
import { notFound } from "next/navigation";
import ManageSalesmanView from "@/components/salesman/ManageSalesmanView";

interface PageProps {
    params: Promise<{
        userId: string
    }>
}

export default async function ManageSalesmanPage({ params }: PageProps) {
    const { userId } = await params;
    const { data: user, error } = await fetchUserDetail(userId);

    if (error || !user) {
        return notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Manage Salesman</h3>
                <p className="text-sm text-muted-foreground">
                    Perform administrative actions for this user account.
                </p>
            </div>
            <ManageSalesmanView userId={user.id} userEmail={user.email} />
        </div>
    );
}
