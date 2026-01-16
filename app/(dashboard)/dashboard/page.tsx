import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth/config"
import { prisma } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate, formatPrice } from "@/lib/utils/format"

export default async function UserDashboard() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  // Get user purchases
  const purchases = await prisma.purchase.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      route: true,
    },
    orderBy: {
      purchasedAt: "desc",
    },
  })

  // Get user subscription
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: session.user.id,
      status: "ACTIVE",
    },
  })

  // Get favorites
  const favorites = await prisma.favorite.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      route: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/">
            <div className="text-2xl font-bold text-primary">RouteMarket</div>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/routes">
              <Button variant="ghost">Browse Routes</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
            {session.user.role === "ADMIN" && (
              <Link href="/admin">
                <Button variant="outline">Admin</Button>
              </Link>
            )}
            <Link href="/api/auth/signout">
              <Button variant="ghost">Sign Out</Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session.user.name}!</p>
        </div>

        {/* Subscription Status */}
        {subscription ? (
          <Card className="mb-8 border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-purple-900">Premium Subscription Active</CardTitle>
              <CardDescription>
                You have unlimited access to all premium routes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-800">
                    Plan: {subscription.planType}
                  </p>
                  <p className="text-sm text-purple-800">
                    Renews: {formatDate(subscription.endDate || new Date())}
                  </p>
                </div>
                <Button variant="outline">Manage Subscription</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">Upgrade to Premium</CardTitle>
              <CardDescription>
                Get unlimited access to all premium routes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-sm text-blue-800">
                  $9.99/month or $99/year - Save 17%!
                </p>
                <Link href="/checkout?type=subscription">
                  <Button>Subscribe Now</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* My Routes */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Routes</CardTitle>
                <CardDescription>
                  Routes you've purchased or have access to
                </CardDescription>
              </CardHeader>
              <CardContent>
                {purchases.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <p>You haven't purchased any routes yet.</p>
                    <Link href="/routes">
                      <Button className="mt-4">Browse Routes</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {purchases.map((purchase) => (
                      <div
                        key={purchase.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div>
                          <p className="font-semibold">{purchase.route.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Purchased on {formatDate(purchase.purchasedAt)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/routes/${purchase.route.id}`}>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </Link>
                          <Link href={`/api/routes/download/${purchase.route.id}`}>
                            <Button size="sm">Download GPX</Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Purchase History */}
            <Card>
              <CardHeader>
                <CardTitle>Purchase History</CardTitle>
                <CardDescription>
                  Your transaction history
                </CardDescription>
              </CardHeader>
              <CardContent>
                {purchases.length === 0 ? (
                  <p className="py-4 text-center text-muted-foreground">
                    No purchases yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {purchases.map((purchase) => (
                      <div
                        key={purchase.id}
                        className="flex items-center justify-between border-b pb-2"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {purchase.route.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(purchase.purchasedAt)}
                          </p>
                        </div>
                        <p className="text-sm font-semibold">
                          {formatPrice(purchase.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle>Account Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{session.user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="text-sm font-medium">{session.user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Purchases</p>
                  <p className="text-sm font-medium">{purchases.length}</p>
                </div>
              </CardContent>
            </Card>

            {/* Favorites */}
            <Card>
              <CardHeader>
                <CardTitle>Favorites</CardTitle>
                <CardDescription>Routes you've saved</CardDescription>
              </CardHeader>
              <CardContent>
                {favorites.length === 0 ? (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    No favorites yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {favorites.slice(0, 5).map((favorite) => (
                      <Link
                        key={favorite.id}
                        href={`/routes/${favorite.route.id}`}
                      >
                        <div className="rounded-lg border p-2 text-sm hover:bg-accent">
                          <p className="font-medium">{favorite.route.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {favorite.route.location}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
