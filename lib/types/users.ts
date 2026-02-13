export interface Users {
    name: string,
    email: string,
    password: string,
    role: "ADMIN" | "SALES",
    status: "ACTIVE" | "DISABLED",
    labels: string[],
}

export type Role = "ADMIN" | "SALES"
export type UserStatus = "ACTIVE" | "DISABLED"