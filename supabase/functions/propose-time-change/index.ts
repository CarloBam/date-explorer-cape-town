import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { shareToken, proposedDatetime, proposerName } = await req.json();

    if (!shareToken || !proposedDatetime) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Get the saved date
    const { data: dateData, error: fetchError } = await supabase
      .from("saved_dates")
      .select("*")
      .eq("share_token", shareToken)
      .single();

    if (fetchError || !dateData) {
      return new Response(JSON.stringify({ error: "Date plan not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Update the proposed datetime
    const { error: updateError } = await supabase
      .from("saved_dates")
      .update({
        proposed_datetime: proposedDatetime,
        proposed_by_name: proposerName || "Your date",
      })
      .eq("share_token", shareToken);

    if (updateError) throw updateError;

    // Get the creator's email from auth.users
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(dateData.user_id);

    if (userError || !userData?.user?.email) {
      console.error("Could not find user email:", userError);
      return new Response(JSON.stringify({ success: true, emailSent: false, reason: "User email not found" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const creatorEmail = userData.user.email;
    const creatorName = userData.user.user_metadata?.full_name || creatorEmail.split("@")[0];
    const proposedDate = new Date(proposedDatetime);
    const dateStr = proposedDate.toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    const timeStr = proposedDate.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });
    const nameLabel = proposerName || "Your date";

    // Send email using Lovable AI gateway (SMTP via edge function)
    // Since we can't send transactional emails directly, we'll use the LOVABLE_API_KEY
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    if (lovableApiKey) {
      try {
        const emailRes = await fetch("https://api.lovable.dev/v1/email/send", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${lovableApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: creatorEmail,
            subject: `💝 ${nameLabel} wants to change the date time!`,
            purpose: "transactional",
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #ffffff;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <div style="font-size: 48px;">💝</div>
                  <h1 style="font-size: 22px; color: #2d2d2d; margin: 8px 0;">Time Change Request</h1>
                </div>
                <p style="color: #555; font-size: 15px; line-height: 1.6;">
                  Hey ${creatorName}! 👋
                </p>
                <p style="color: #555; font-size: 15px; line-height: 1.6;">
                  <strong>${nameLabel}</strong> has proposed a new time for your date plan "${dateData.title || "Date Plan"}":
                </p>
                <div style="background: #fff5f0; border-radius: 12px; padding: 16px; text-align: center; margin: 16px 0;">
                  <div style="font-size: 14px; color: #888;">New proposed time:</div>
                  <div style="font-size: 20px; font-weight: bold; color: #e8523f; margin-top: 4px;">📅 ${dateStr}</div>
                  <div style="font-size: 18px; font-weight: bold; color: #e8523f;">🕐 ${timeStr}</div>
                </div>
                <p style="color: #555; font-size: 15px; line-height: 1.6;">
                  Log in to Cape Town Dates to update your calendar invite and confirm the new time.
                </p>
                <div style="text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #eee;">
                  <span style="color: #999; font-size: 12px;">Cape Town Dates • Secure Sharing</span>
                </div>
              </div>
            `,
          }),
        });

        if (emailRes.ok) {
          return new Response(JSON.stringify({ success: true, emailSent: true }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      } catch (emailErr) {
        console.error("Email send failed:", emailErr);
      }
    }

    return new Response(JSON.stringify({ success: true, emailSent: false }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
