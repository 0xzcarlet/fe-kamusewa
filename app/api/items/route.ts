import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = createServerClient()

  // Get query parameters for filtering
  const url = new URL(request.url)
  const searchQuery = url.searchParams.get("search") || ""
  const categoryFilter = url.searchParams.get("category") || ""

  let query = supabase
    .from("items")
    .select(`
      *,
      categories(id, name)
    `)
    .order("name")

  // Apply filters if provided
  if (searchQuery) {
    query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
  }

  if (categoryFilter && categoryFilter !== "all") {
    query = query.eq("category_id", categoryFilter)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Transform the data to match the expected format in the frontend
  const transformedData = data.map((item) => ({
    ...item,
    category: item.categories?.name || "Uncategorized",
  }))

  return NextResponse.json(transformedData)
}

export async function POST(request: NextRequest) {
  const supabase = createServerClient()
  const body = await request.json()

  const { data, error } = await supabase
    .from("items")
    .insert([
      {
        name: body.name,
        category_id: body.category_id ? Number.parseInt(body.category_id) : null,
        price: body.price,
        stock: body.stock,
        status: body.status,
        description: body.description,
        image_url: body.image_url,
      },
    ])
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data[0])
}
