import { GET } from '../src/app/api/seed/route'

async function run() {
  console.log('Seeding real Mr.Raw Travel packages directly...')
  const res = await GET()
  const data = await res.json()
  console.log('Seed result:', data)
}

run().catch(console.error)
