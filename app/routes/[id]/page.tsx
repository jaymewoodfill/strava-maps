import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth/config"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatDistance, formatElevation, formatPrice } from "@/lib/utils/format"
import { RouteMap } from "@/components/map/route-map"

export default async function RouteDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()
  
  const route = await prisma.route.findUnique({
    where: { id: params.id },
  })

  if (!route || !route.isPublished) {
    notFound()
  }

  // Check if user has access to this route
  let hasAccess = false
  if (session?.user) {
    // Check if purchased
    const purchase = await prisma.purchase.findUnique({
      where: {
        userId_routeId: {
          userId: session.user.id,
          routeId: route.id,
        },
      },
    })

    // Check if has premium subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
      },
    })

    hasAccess = !!purchase || !!subscription
  }

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
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="relative h-96 w-full overflow-hidden rounded-lg">
              <Image
                src={route.thumbnailUrl || "/placeholder-route.jpg"}
                alt={route.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Title and Description */}
            <div>
              <h1 className="text-4xl font-bold">{route.title}</h1>
              <p className="mt-2 text-lg text-muted-foreground">
                {route.location}
              </p>
              <p className="mt-4 text-base leading-relaxed">
                {route.description}
              </p>
            </div>

            {/* Stats */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Distance</p>
                    <p className="text-2xl font-bold">
                      {formatDistance(route.distance)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Elevation Gain</p>
                    <p className="text-2xl font-bold">
                      {formatElevation(route.elevationGain)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Difficulty</p>
                    <p className="text-2xl font-bold capitalize">
                      {route.difficulty.toLowerCase()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card>
              <CardContent className="p-0">
                <RouteMap gpxUrl={route.gpxFileUrl} className="h-96" />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardContent className="pt-6 space-y-4">
                {route.accessType === "FREE" ? (
                  <>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">FREE</p>
                      <p className="text-sm text-muted-foreground">
                        Email required
                      </p>
                    </div>
                    <Button className="w-full" size="lg">
                      Get Free Route
                    </Button>
                  </>
                ) : route.accessType === "PREMIUM" ? (
                  <>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Premium Only
                      </p>
                      <p className="text-3xl font-bold text-purple-600">
                        Subscription Required
                      </p>
                    </div>
                    {hasAccess ? (
                      <Button className="w-full" size="lg">
                        Download GPX
                      </Button>
                    ) : (
                      <Link href="/checkout?type=subscription">
                        <Button className="w-full" size="lg">
                          Subscribe Now
                        </Button>
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        One-time purchase
                      </p>
                      <p className="text-4xl font-bold">
                        {formatPrice(route.price || 0)}
                      </p>
                    </div>
                    {hasAccess ? (
                      <Button className="w-full" size="lg">
                        Download GPX
                      </Button>
                    ) : (
                      <Link href={`/checkout?routeId=${route.id}`}>
                        <Button className="w-full" size="lg">
                          Purchase Route
                        </Button>
                      </Link>
                    )}
                  </>
                )}

                <div className="space-y-2 pt-4 border-t">
                  <p className="text-sm font-semibold">What's included:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>✓ GPX file for navigation</li>
                    <li>✓ Detailed route description</li>
                    <li>✓ Elevation profile</li>
                    <li>✓ Points of interest</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
