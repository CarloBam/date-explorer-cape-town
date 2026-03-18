import { useState } from "react";
import { motion } from "framer-motion";
import { Share2, Copy, Check, Mail, MessageCircle, Shield, Link2, X, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Activity } from "@/lib/dateData";
import { toast } from "sonner";

interface ShareDateModalProps {
  activities: Activity[];
  budget: number;
  totalCost: number;
  quizAnswers: Record<string, any>;
  scheduledDate?: Date;
  onClose: () => void;
}

export function ShareDateModal({ activities, budget, totalCost, quizAnswers, scheduledDate, onClose }: ShareDateModalProps) {
  const { user } = useAuth();
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [title, setTitle] = useState("");
  const [allowCustomise, setAllowCustomise] = useState(false);

  // Get user's display name from metadata
  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Someone special";

  const generateShareLink = async () => {
    if (!user) {
      toast.error("Please sign in to share date plans");
      return;
    }

    setLoading(true);
    try {
      // Generate a friendly, short token
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let token = "";
      for (let i = 0; i < 8; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
      }

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const { error } = await supabase.from("saved_dates").insert({
        user_id: user.id,
        title: title || "Date Plan",
        activities: activities.map(a => ({ id: a.id, name: a.name, area: a.area, estimatedCost: a.estimatedCost, duration: a.duration, image: a.image, description: a.description, deals: a.deals })),
        budget,
        total_cost: totalCost,
        quiz_answers: { ...quizAnswers, senderName: userName, senderEmail: user.email },
        share_token: token,
        share_expires_at: expiresAt.toISOString(),
        allow_customise: allowCustomise,
        date_response: "pending",
        date_scheduled: scheduledDate ? scheduledDate.toISOString() : null,
      });

      if (error) throw error;

      const safeName = userName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "someone";
      const url = `${window.location.origin}/from/${safeName}/${token}`;
      setShareUrl(url);
      toast.success("Share link created! 🎉");
    } catch (err: any) {
      toast.error(err.message || "Failed to create share link");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const timeLabel = scheduledDate ? format(scheduledDate, "h:mm a") : "";
  const dateLabel = scheduledDate ? format(scheduledDate, "EEEE, d MMMM yyyy") : "";
  const dateTimeText = scheduledDate ? `\n📅 ${dateLabel} at ${timeLabel}` : "";

  const shareWhatsApp = () => {
    if (!shareUrl) return;
    const customiseNote = allowCustomise ? "\n\n✏️ You can also propose changes to the plan if you'd like!" : "";
    const titleText = title ? ` — "${title}"` : "";
    const message = encodeURIComponent(
      `Hey! 💝\n\n${userName} would like to ask you to go on a date!${titleText}${dateTimeText}\n\n🔗 Click here to see the activities planned for you:\n${shareUrl}${customiseNote}\n\n🤗🤗🤗`
    );
    // Use api.whatsapp.com which works on both mobile and desktop
    window.open(`https://api.whatsapp.com/send?text=${message}`, "_blank");
  };

  const shareEmail = () => {
    if (!shareUrl) return;
    const subject = encodeURIComponent(`${userName} wants to take you on a date! 💝`);
    const customiseNote = allowCustomise ? "\n\n✏️ You can also propose changes to the plan if you'd like!" : "";
    const body = encodeURIComponent(
      `Hey! 💝\n\n${userName} would like to ask you to go on a date!${dateTimeText}\n\nClick here to see the activities planned for you:\n${shareUrl}${customiseNote}\n\n🤗🤗🤗`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm px-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-border bg-card shadow-warm overflow-hidden"
      >
        {/* Header */}
        <div className="gradient-sunset px-6 py-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-primary-foreground flex items-center gap-2">
            <Share2 className="h-5 w-5" /> Share Your Date Plan
          </h2>
          <button onClick={onClose} className="text-primary-foreground/70 hover:text-primary-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {!shareUrl ? (
            <>
              {/* Title */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Date title</label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Optional — e.g. Our Cape Town Date 💝" />
              </div>

              {/* Scheduled date display */}
              {scheduledDate && (
                <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm text-foreground">
                  📅 {format(scheduledDate, "EEEE, d MMMM yyyy")}
                </div>
              )}

              {/* Allow customise toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Let her customise?</p>
                  <p className="text-xs text-muted-foreground">She can swap activities if enabled</p>
                </div>
                <Switch checked={allowCustomise} onCheckedChange={setAllowCustomise} />
              </div>

              {/* Preview */}
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground mb-2">She'll see:</p>
                {activities.slice(0, 3).map(a => (
                  <div key={a.id} className="text-sm text-foreground flex items-center gap-2 py-0.5">
                    <span>{a.image}</span> {a.name}
                  </div>
                ))}
                {activities.length > 3 && (
                  <p className="text-xs text-muted-foreground mt-1">+{activities.length - 3} more activities</p>
                )}
              </div>

              {/* Security note */}
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <Shield className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                <span>Links are encrypted and expire after 7 days. No account needed to view.</span>
              </div>

              <Button
                variant="hero"
                className="w-full gap-2"
                onClick={generateShareLink}
                disabled={loading || activities.length === 0}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
                Generate Secure Link
              </Button>
            </>
          ) : (
            <>
              {/* Share link created */}
              <div className="text-center mb-2">
                <div className="text-4xl mb-2">🎉</div>
                <p className="font-display font-bold text-foreground">Link Ready!</p>
              </div>

              {/* QR Code */}
              <div className="flex justify-center">
                <div className="rounded-xl border border-border bg-white p-3 shadow-card">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(shareUrl)}&color=2d2d2d&bgcolor=ffffff&margin=1`}
                    alt="QR code for date plan"
                    className="h-[180px] w-[180px]"
                  />
                </div>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Save or screenshot the QR code to share in person 💌
              </p>

              {/* Link display */}
              <div className="flex items-center gap-2">
                <Input value={shareUrl} readOnly className="text-xs font-mono" />
                <Button variant="outline" size="icon" onClick={copyLink} className="shrink-0">
                  {copied ? <Check className="h-4 w-4 text-secondary" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              {/* Share buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button variant="default" className="gap-2 bg-[hsl(145,70%,36%)] hover:bg-[hsl(145,70%,30%)] text-primary-foreground" onClick={shareWhatsApp}>
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </Button>
                <Button variant="outline" className="gap-2" onClick={shareEmail}>
                  <Mail className="h-4 w-4" /> Email
                </Button>
              </div>

              {/* Copy full link button */}
              <Button variant="ghost" className="w-full gap-2 text-sm" onClick={copyLink}>
                <Copy className="h-4 w-4" /> {copied ? "Copied!" : "Copy Link to Clipboard"}
              </Button>

              <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                <Shield className="h-3 w-3 text-secondary" />
                Secure link • Expires in 7 days • No login required
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
