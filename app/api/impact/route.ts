import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("impact_counters")
    .select("*")
    .eq("id", "global")
    .single()

  if (error) {
    // If no row exists yet, return defaults
    if (error.code === "PGRST116") {
      return NextResponse.json({
        trees: 0,
        messages: 0,
        shares: 0
      })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    trees: data.trees_planted,
    messages: data.messages_sent,
    shares: data.shares
  })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { action } = await request.json()

  if (!["trees", "messages", "shares"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }

  const columnMap: Record<string, string> = {
    trees: "trees_planted",
    messages: "messages_sent",
    shares: "shares"
  }

  const column = columnMap[action]

  // Use upsert with increment
  const { data: current } = await supabase
    .from("impact_counters")
    .select(column)
    .eq("id", "global")
    .single()

  const currentValue = current ? (current as Record<string, number>)[column] : 0

  const { data, error } = await supabase
    .from("impact_counters")
    .upsert({
      id: "global",
      [column]: currentValue + 1,
      updated_at: new Date().toISOString()
    }, {
      onConflict: "id"
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    trees: data.trees_planted,
    messages: data.messages_sent,
    shares: data.shares
  })
}
