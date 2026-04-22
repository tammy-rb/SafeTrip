import { useEffect, useMemo, useRef } from 'react'
import { Box, Typography } from '@mui/material'
import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIconImage from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

/* marker icon assets for Leaflet. */
const markerIcon = L.icon({
  iconUrl: markerIconImage,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

/* Fits map bounds to all visible points when data is first loaded or marker count changes. */
function FitMapToLocations({ locations }) {
  const map = useMap()
  // keep track there is only one fitBounds call on initial load or when marker count changes, to avoid excessive fitting on every render.
  const hasFittedRef = useRef(false)
  // Track previous marker count to detect changes and refit map if needed.
  const previousCountRef = useRef(0)

  useEffect(() => {
    if (!locations.length) {
      hasFittedRef.current = false
      previousCountRef.current = 0
      return
    }

    const positions = locations.map((loc) => [
      Number(loc.latitude_decimal),
      Number(loc.longitude_decimal),
    ])

    const bounds = L.latLngBounds(positions)
    const markerCountChanged = previousCountRef.current !== locations.length

    if (!hasFittedRef.current || markerCountChanged) {
      map.fitBounds(bounds, {
        padding: [40, 40],
        maxZoom: 16,
      })
      hasFittedRef.current = true
      previousCountRef.current = locations.length
    }
  }, [locations, map])

  return null
}

/* Shows students latest locations on a map with marker details. */
function MapView({ locations }) {
  const validLocations = useMemo(
    () => locations.filter((loc) => Number(loc.latitude_decimal) && Number(loc.longitude_decimal)),
    [locations],
  )
  // Default center is Jerusalem if no valid locations, otherwise fit to first valid location.
  const center = validLocations.length
    ? [Number(validLocations[0].latitude_decimal), Number(validLocations[0].longitude_decimal)]
    : [31.7683, 35.2137]

  return (
    <Box>
      {!validLocations.length ? (
        <Typography color="text.secondary" sx={{ mb: 1 }}>
          No location points available yet.
        </Typography>
      ) : null}
      <Box sx={{ height: 360, borderRadius: 1, overflow: 'hidden', border: '1px solid #d8e1ef' }}>
        <MapContainer center={center} zoom={11} style={{ height: '100%', width: '100%' }}>
          {/* map background tiles from OpenStreetMap */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* logic unvisible component. run on any comeonent render to check if map need to fit  */}
          <FitMapToLocations locations={validLocations} />

          {validLocations.map((loc) => (
            <Marker
              key={loc.student_id_number}
              position={[Number(loc.latitude_decimal), Number(loc.longitude_decimal)]}
              icon={markerIcon}
            >
              <Popup>
                <div>
                  <div>ID: {loc.student_id_number}</div>
                  <div>Class: {loc.class_name}</div>
                  <div>Updated: {new Date(loc.device_time).toLocaleString()}</div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>
    </Box>
  )
}

export default MapView
