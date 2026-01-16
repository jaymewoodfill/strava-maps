import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminDashboard() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  // Get statistics
  const [totalRoutes, totalUsers, totalPurchases, totalRevenue] = await Promise.all([
    prisma.route.count(),
    prisma.user.count(),
    prisma.purchase.count(),
    prisma.purchase.aggregate({
      _sum: {
        amount: true,
      },
    }),
  ])

  const recentRoutes = await prisma.route.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/">
            <div className="text-2xl font-bold text-primary">RouteMarket Admin</div>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/routes">
              <Button variant="ghost">Browse Routes</Button>
            </Link>
            <Link href="/admin">
              <Button variant="outline">Admin</Button>
            </Link>
            <Link href="/api/auth/signout">
              <Button variant="ghost">Sign Out</Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your route marketplace</p>
          </div>
          <Link href="/admin/routes/new">
            <Button size="lg">Add New Route</Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Routes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalRoutes}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalUsers}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Purchases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalPurchases}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                ${(totalRevenue._sum.amount || 0).toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Routes */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Routes</CardTitle>
            <CardDescription>Latest routes added to the marketplace</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRoutes.map((route) => (
                <div
                  key={route.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-semibold">{route.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {route.location} · {route.accessType}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/routes/${route.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                    <Link href={`/admin/routes/${route.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Link href="/admin/routes">
                <Button variant="outline" className="w-full">
                  View All Routes
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
