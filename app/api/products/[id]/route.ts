/**
 * API Route: /api/products/[id]
 *
 * GET    - Fetch a single product by ID
 * PUT    - Update a product by ID
 * DELETE - Delete a product by ID
 */

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const productId = params.id;
  // TODO: Implement GET handler
  // - Fetch product by ID from database
  // - Return 404 if not found
  return Response.json({ message: `GET /api/products/${productId}` });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const productId = params.id;
  // TODO: Implement PUT handler
  // - Validate request body
  // - Update product in database
  // - Return updated product
  return Response.json({ message: `PUT /api/products/${productId}` });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const productId = params.id;
  // TODO: Implement DELETE handler
  // - Delete product from database
  // - Return success message
  return Response.json({ message: `DELETE /api/products/${productId}` });
}
