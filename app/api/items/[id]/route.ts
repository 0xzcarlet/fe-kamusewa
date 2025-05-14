import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("items")
    .select(`
      *,
      categories(id, name)
    `)
    .eq("id", params.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Transform the data to match the expected format in the frontend
  const transformedData = {
    ...data,
    category: data.categories?.name || "Uncategorized",
  }

  return NextResponse.json(transformedData)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerClient()
  const body = await request.json()

  const { data, error } = await supabase
    .from("items")
    .update({
      name: body.name,
      category_id: body.category_id ? Number.parseInt(body.category_id) : null,
      price: body.price,
      stock: body.stock,
      status: body.status,
      description: body.description,
      image_url: body.image_url,
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

  const { error } = await supabase.from("items").delete().eq("id", params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
