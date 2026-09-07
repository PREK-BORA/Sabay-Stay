import fs from 'node:fs'
import path from 'node:path'

export default defineEventHandler(() => {
  const filePath = path.resolve(process.cwd(), 'server/data/db.json')
  
  if (!fs.existsSync(filePath)) {
    return []
  }

  const rawData = fs.readFileSync(filePath, 'utf-8')
  const db = JSON.parse(rawData)

  return db.hotels || []
})