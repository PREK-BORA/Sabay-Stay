import fs from 'node:fs'
import path from 'node:path'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const hotelId = Number(query.id)

  if (!hotelId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Valid Hotel ID parameter is required.'
    })
  }

  const filePath = path.resolve(process.cwd(), 'server/data/db.json')
  const rawData = fs.readFileSync(filePath, 'utf-8')
  const db = JSON.parse(rawData)

  db.hotels = db.hotels.filter((h: { id: number }) => h.id !== hotelId)

  fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf-8')

  return {
    success: true,
    message: `Hotel ${hotelId} deleted successfully.`
  }
})