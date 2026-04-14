import { NextResponse } from "next/server"

interface Representative {
  name: string
  office: string
  party?: string
  website?: string
  phone?: string
  officeAddress?: string
}

interface WhoIsMyRepResult {
  name: string
  state: string
  district?: string
  phone: string
  office: string
  link: string
}

interface WhoIsMyRepResponse {
  results?: WhoIsMyRepResult[]
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

  try {
    // Use whoismyrepresentative.com API - free, no API key required
    const response = await fetch(
      `https://whoismyrepresentative.com/getall_mems.php?zip=${zipCode}&output=json`,
      {
        headers: {
          "Accept": "application/json",
        },
      }
    )

    if (!response.ok) {
      // If the API fails, return helpful fallback
      return NextResponse.json({
        representatives: getFallbackWithInstructions(zipCode),
        note: "Could not look up representatives. Use the links below to find your representatives.",
      })
    }

    const text = await response.text()
    
    // Handle case where API returns error message instead of JSON
    if (text.includes("error") || text.includes("No reps found") || !text.startsWith("{")) {
      return NextResponse.json({
        representatives: getFallbackWithInstructions(zipCode),
        note: "No representatives found for this zip code. Use the links below to find your representatives.",
      })
    }

    const data: WhoIsMyRepResponse = JSON.parse(text)

    if (!data.results || data.results.length === 0) {
      return NextResponse.json({
        representatives: getFallbackWithInstructions(zipCode),
        note: "No representatives found for this zip code.",
      })
    }

    const representatives: Representative[] = data.results.map((rep) => {
      // Determine if senator or representative based on district
      const isSenator = !rep.district || rep.district === ""
      
      return {
        name: rep.name,
        office: isSenator 
          ? `U.S. Senator (${rep.state})`
          : `U.S. Representative (${rep.state}-${rep.district})`,
        website: rep.link,
        phone: rep.phone,
        officeAddress: rep.office,
      }
    })

    return NextResponse.json({ representatives })
  } catch (error) {
    console.error("Representative lookup error:", error)
    return NextResponse.json({
      representatives: getFallbackWithInstructions(zipCode),
      note: "Failed to look up representatives. Use the links below to find your representatives.",
    })
  }
}

function getFallbackWithInstructions(zipCode: string): Representative[] {
  return [
    {
      name: "Find Your Senator",
      office: "U.S. Senate",
      website: "https://www.senate.gov/senators/senators-contact.htm",
      phone: "(202) 224-3121",
      officeAddress: `Look up your senators for zip code ${zipCode}`,
    },
    {
      name: "Find Your Representative",
      office: "U.S. House of Representatives",
      website: "https://www.house.gov/representatives/find-your-representative",
      phone: "(202) 224-3121",
      officeAddress: `Look up your representative for zip code ${zipCode}`,
    },
  ]
}
