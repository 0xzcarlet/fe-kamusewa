import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("categories").select("*").eq("id", params.id).single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerClient()
  const body = await request.json()

  const { data, error } = await supabase
    .from("categories")
    .update({
      name: body.name,
      description: body.description,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.id)
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data[0])
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerClient()

  const { error } = await supabase.from("categories").delete().eq("id", params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
