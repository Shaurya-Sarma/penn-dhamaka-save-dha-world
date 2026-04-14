import { NextResponse } from "next/server"

interface Representative {
  name: string
  office: string
  party?: string
  emails?: string[]
  phones?: string[]
}

interface CivicApiOfficial {
  name: string
  party?: string
  emails?: string[]
  phones?: string[]
}

interface CivicApiOffice {
  name: string
  officialIndices: number[]
}

interface CivicApiResponse {
  offices?: CivicApiOffice[]
  officials?: CivicApiOfficial[]
  error?: { message: string }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const zipCode = searchParams.get("zipCode")

  if (!zipCode || !/^\d{5}$/.test(zipCode)) {
    return NextResponse.json(
      { error: "Please enter a valid 5-digit zip code" },
      { status: 400 }
    )
  }

  const apiKey = process.env.GOOGLE_CIVIC_API_KEY

  // If no API key, return sample data for demo purposes
  if (!apiKey) {
    return NextResponse.json({
      representatives: getSampleRepresentatives(zipCode),
      note: "Demo mode - showing sample representatives",
    })
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/civicinfo/v2/representatives?address=${zipCode}&key=${apiKey}`
    )

    const data: CivicApiResponse = await response.json()

    if (data.error) {
      return NextResponse.json(
        { error: data.error.message },
        { status: 400 }
      )
    }

    const representatives: Representative[] = []

    if (data.offices && data.officials) {
      for (const office of data.offices) {
        // Filter to federal and state level representatives
        if (
          office.name.includes("Senator") ||
          office.name.includes("Representative") ||
          office.name.includes("Congress") ||
          office.name.includes("Governor")
        ) {
          for (const index of office.officialIndices) {
            const official = data.officials[index]
            if (official) {
              representatives.push({
                name: official.name,
                office: office.name,
                party: official.party,
                emails: official.emails,
                phones: official.phones,
              })
            }
          }
        }
      }
    }

    // If no representatives found with emails, return sample data
    if (representatives.length === 0) {
      return NextResponse.json({
        representatives: getSampleRepresentatives(zipCode),
        note: "No representatives found for this zip code",
      })
    }

    return NextResponse.json({ representatives })
  } catch {
    return NextResponse.json(
      { error: "Failed to look up representatives. Please try again." },
      { status: 500 }
    )
  }
}

function getSampleRepresentatives(zipCode: string): Representative[] {
  // Return sample representatives for demo purposes
  return [
    {
      name: "Your U.S. Senator",
      office: "U.S. Senate",
      emails: [`senator@senate.gov`],
      party: "Unknown",
    },
    {
      name: "Your U.S. Representative",
      office: `U.S. House of Representatives (${zipCode})`,
      emails: [`representative@house.gov`],
      party: "Unknown",
    },
  ]
}
