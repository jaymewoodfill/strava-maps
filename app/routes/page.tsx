import Link from "next/link"
import { prisma } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RouteCard } from "@/components/route-card/route-card"

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function RoutesPage({ searchParams }: PageProps) {
  const search = typeof searchParams.search === 'string' ? searchParams.search : ''
  const difficulty = typeof searchParams.difficulty === 'string' ? searchParams.difficulty : undefined
  const accessType = typeof searchParams.accessType === 'string' ? searchParams.accessType : undefined

  // Build filter conditions
  const where: any = {
    isPublished: true,
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { location: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (difficulty) {
    where.difficulty = difficulty.toUpperCase()
  }

  if (accessType) {
    where.accessType = accessType.toUpperCase()
  }

  const routes = await prisma.route.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
    take: 50,
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
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Browse Routes</h1>
          <p className="mt-2 text-muted-foreground">
            Discover amazing cycling and running routes
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 rounded-lg border bg-white p-4">
          <form method="get" className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                name="search"
                placeholder="Search routes..."
                defaultValue={search}
              />
            </div>

            <select
              name="difficulty"
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              defaultValue={difficulty || ""}
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="hard">Hard</option>
              <option value="expert">Expert</option>
            </select>

            <select
              name="accessType"
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              defaultValue={accessType || ""}
            >
              <option value="">All Types</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
              <option value="premium">Premium</option>
            </select>

            <Button type="submit">Apply Filters</Button>
          </form>
        </div>

        {/* Routes Grid */}
        {routes.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">
              No routes found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {routes.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
