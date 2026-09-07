import fs from 'node:fs'
import path from 'node:path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body?.id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Hotel ID is required for updates.'
    })
  }

  const filePath = path.resolve(process.cwd(), 'server/data/db.json')
  const rawData = fs.readFileSync(filePath, 'utf-8')
  const db = JSON.parse(rawData)

  const index = db.hotels.findIndex((h: { id: number }) => h.id === Number(body.id))

  if (index === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Hotel property not found.'
    })
  }

  db.hotels[index] = {
    ...db.hotels[index],
    ...body,
    pricePerNight: body.pricePerNight ? Number(body.pricePerNight) : db.hotels[index].pricePerNight
  }

  fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf-8')

  return {
    success: true,
    hotel: db.hotels[index]
  }
})