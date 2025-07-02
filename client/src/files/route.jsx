
export async function GET(request, { params }) {
    const { ticketID } = params;
    return Response.json({
        test: ticketID,
    })
}