import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDistance, formatElevation, formatPrice } from "@/lib/utils/format"

interface RouteCardProps {
  route: {
    id: string
    title: string
    description: string
    distance: number
    elevationGain: number
    difficulty: string
    location: string
    thumbnailUrl: string
    accessType: string
    price?: number | null
  }
}

export function RouteCard({ route }: RouteCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-green-600"
      case "moderate":
        return "text-yellow-600"
      case "hard":
        return "text-orange-600"
      case "expert":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={route.thumbnailUrl || "/placeholder-route.jpg"}
          alt={route.title}
          fill
          className="object-cover"
        />
        <div className="absolute right-2 top-2 rounded-md bg-white/90 px-2 py-1 text-xs font-semibold">
          {route.accessType === "FREE" ? (
            <span className="text-green-600">FREE</span>
          ) : route.accessType === "PREMIUM" ? (
            <span className="text-purple-600">PREMIUM</span>
          ) : (
            <span className="text-blue-600">{formatPrice(route.price || 0)}</span>
          )}
        </div>
      </div>

      <CardHeader>
        <CardTitle className="line-clamp-1">{route.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {route.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Distance</p>
            <p className="font-semibold">{formatDistance(route.distance)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Elevation</p>
            <p className="font-semibold">{formatElevation(route.elevationGain)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Difficulty</p>
            <p className={`font-semibold capitalize ${getDifficultyColor(route.difficulty)}`}>
              {route.difficulty}
            </p>
          </div>
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          {route.location}
        </div>
      </CardContent>

      <CardFooter>
        <Link href={`/routes/${route.id}`} className="w-full">
          <Button variant="default" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
