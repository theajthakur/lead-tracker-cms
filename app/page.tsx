import { createNewSalesman } from '@/lib/api/users'

export default function page() {
  createNewSalesman({
    name: "Vijay Singh",
    email: "vijaysingh.handler@gmail.com",
    password: "ajaysingh2.0",
    role: "ADMIN",
    status: "ACTIVE",
    labels: ["NEW", "PENDING", "FINISH"],
  })
  return (
    <div>page</div>
  )
}
