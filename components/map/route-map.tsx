"use client"

import { useEffect, useRef } from "react"

interface RouteMapProps {
  gpxUrl: string
  className?: string
}

export function RouteMap({ gpxUrl, className }: RouteMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    // Initialize Mapbox GL
    if (typeof window !== "undefined" && (window as any).mapboxgl) {
      const mapboxgl = (window as any).mapboxgl
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

      if (!map.current) {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/outdoors-v12",
          center: [-122.4, 37.8],
          zoom: 12,
        })

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), "top-right")

        // Fetch and display GPX route
        map.current.on("load", async () => {
          try {
            const response = await fetch(gpxUrl)
            const gpxText = await response.text()
            
            // Parse GPX to GeoJSON (simplified - in production use @tmcw/togeojson)
            // This is a placeholder - actual GPX parsing would happen here
            
            // For demo purposes, show a simple route
            map.current.addSource("route", {
              type: "geojson",
              data: {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "LineString",
                  coordinates: [
                    [-122.4, 37.8],
                    [-122.41, 37.81],
                    [-122.42, 37.82],
                  ],
                },
              },
            })

            map.current.addLayer({
              id: "route",
              type: "line",
              source: "route",
              layout: {
                "line-join": "round",
                "line-cap": "round",
              },
              paint: {
                "line-color": "#4F46E5",
                "line-width": 4,
              },
            })
          } catch (error) {
            console.error("Error loading GPX:", error)
          }
        })
      }
    }

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [gpxUrl])

  return (
    <div className={className}>
      <div ref={mapContainer} className="h-full w-full rounded-lg" />
    </div>
  )
}
