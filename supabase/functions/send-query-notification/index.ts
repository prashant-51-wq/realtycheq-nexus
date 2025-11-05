import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface QueryNotificationRequest {
  name: string;
  email: string;
  phone?: string;
  locationPreference?: string;
  propertyType?: string;
  budgetMin?: number;
  budgetMax?: number;
  bedrooms?: number;
  requirements?: string;
  additionalNotes?: string;
  queryType: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const queryData: QueryNotificationRequest = await req.json();

    // Send notification to admin
    const adminEmailResponse = await resend.emails.send({
      from: "RealtyCheq <noreply@resend.dev>",
      to: ["admin@realtycheq.com"], // Replace with actual admin email
      subject: `New ${queryData.queryType} Query - ${queryData.name}`,
      html: `
        <h1>New Property Query Received</h1>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2>Customer Details</h2>
          <p><strong>Name:</strong> ${queryData.name}</p>
          <p><strong>Email:</strong> ${queryData.email}</p>
          <p><strong>Phone:</strong> ${queryData.phone || 'Not provided'}</p>
        </div>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2>Requirements</h2>
          <p><strong>Query Type:</strong> ${queryData.queryType}</p>
          <p><strong>Location Preference:</strong> ${queryData.locationPreference || 'Not specified'}</p>
          <p><strong>Property Type:</strong> ${queryData.propertyType || 'Not specified'}</p>
          <p><strong>Budget:</strong> ₹${queryData.budgetMin?.toLocaleString() || 'N/A'} - ₹${queryData.budgetMax?.toLocaleString() || 'N/A'}</p>
          <p><strong>Bedrooms:</strong> ${queryData.bedrooms || 'Not specified'}</p>
          <p><strong>Requirements:</strong> ${queryData.requirements || 'Not provided'}</p>
          <p><strong>Additional Notes:</strong> ${queryData.additionalNotes || 'None'}</p>
        </div>
        
        <p style="margin-top: 20px;">Please follow up with this customer within 24 hours.</p>
      `,
    });

    // Send confirmation to customer
    const customerEmailResponse = await resend.emails.send({
      from: "RealtyCheq <noreply@resend.dev>",
      to: [queryData.email],
      subject: "We received your property query!",
      html: `
        <h1>Thank you for your query, ${queryData.name}!</h1>
        <p>We have received your property requirements and our team will get back to you within 24 hours.</p>
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <h2>Your Requirements Summary</h2>
          <p><strong>Query Type:</strong> ${queryData.queryType}</p>
          <p><strong>Location:</strong> ${queryData.locationPreference || 'Not specified'}</p>
          <p><strong>Property Type:</strong> ${queryData.propertyType || 'Any'}</p>
          <p><strong>Budget Range:</strong> ₹${queryData.budgetMin?.toLocaleString() || 'N/A'} - ₹${queryData.budgetMax?.toLocaleString() || 'N/A'}</p>
          ${queryData.bedrooms ? `<p><strong>Bedrooms:</strong> ${queryData.bedrooms}</p>` : ''}
        </div>
        
        <p>In the meantime, you can browse our latest properties on our platform.</p>
        <p>Best regards,<br>The RealtyCheq Team</p>
      `,
    });

    console.log("Admin email sent successfully:", adminEmailResponse);
    console.log("Customer email sent successfully:", customerEmailResponse);

    return new Response(JSON.stringify({ 
      success: true,
      adminEmail: adminEmailResponse,
      customerEmail: customerEmailResponse 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-query-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);