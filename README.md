# Lead Management CMS

A comprehensive Content Management System (CMS) designed for efficient lead tracking and management. Built with modern web technologies to provide a seamless experience for sales teams and administrators.

## 🚀 Features

- **Role-Based Access Control (RBAC)**: secure login with distinct roles for **Admin** and **Sales** users.
- **Lead Management**:
  - Create, edit, and delete leads.
  - Kanban-style board for dragging and dropping leads across different stages.
  - Detailed lead information including source, description, and follow-up status.
- **Interactive Dashboard**: Visual insights into lead distribution and sales performance using dynamic charts.
- **User Management**:
  - Admins can manage user accounts.
  - Activation and deactivation of user access.
- **Responsive Design**: Fully responsive UI/UX built with Tailwind CSS and Shadcn UI.
- **Salesman Management**:
  - View list of all salesmen with key metrics (leads assigned, join date, status).
  - **Profile View**: Detailed profile page for each salesman.
  - **Leads View**: Kanban board specific to each salesman's assigned leads.
  - **Administrative Actions**:
    - **Add Salesman**: Create new accounts with auto-generated credentials.
    - **Manage Access**: Deactivate/Activate user accounts.
    - **Reset Password**: Admin can reset salesman passwords and copy new credentials.
    - **Delete User**: Permanently remove a salesman and cascade delete their assigned leads.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) / [Radix UI](https://www.radix-ui.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
- **Forms**: React Hook Form + Zod

## 📂 Project Structure

```bash
├── app/                # Next.js App Router pages and layouts
│   ├── admin/          # Admin-specific routes
│   ├── api/            # API routes
│   ├── leads/          # Lead management pages
│   ├── login/          # Authentication pages
│   └── ...
├── components/         # Reusable UI components
├── prisma/             # Database schema and migrations
└── ...
```

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd cms
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Set up Environment Variables:**

    Create a `.env` file in the root directory and add the following variables:

    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/cms_db?schema=public"
    NEXTAUTH_SECRET="your-secret-key"
    NEXTAUTH_URL="http://localhost:3000"
    ```

4.  **Database Setup:**

    Run Prisma migrations to create the database schema:

    ```bash
    npx prisma migrate dev
    ```

5.  **Run the Development Server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📘 Usage
 
 ### Admin Dashboard
 1.  **Login**: Access the admin panel using your credentials.
 2.  **Salesman Management**:
     -   Navigate to the **Salesman** tab to view all team members.
     -   Click **Add Salesman** to onboard new staff.
     -   Click on a salesman row to view their **Profile** and **Leads**.
     -   Use the **Manage** tab within a salesman's profile to **Reset Password** or **Delete User**.
 3.  **Lead Analytics**: View real-time charts on the main dashboard to track lead distribution and conversion rates.
 
 ### Salesman Portal
 1.  **Lead Tracking**: View assigned leads in a Kanban board.
 2.  **Update Status**: Drag and drop leads to update their stage (e.g., from "New" to "Follow Up").
 3.  **Lead Details**: Click on a lead card to view and edit detailed information.
 
 ## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
