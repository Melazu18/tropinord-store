/**
 * ChatbotWidget
 * Floating AI customer service chat (UI only).
 *
 * Backend: /api/chat (Vercel serverless function). Set OPENAI_API_KEY in Vercel.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Message = { role: "user" | "assistant"; content: string };

async function sendToBot(messages: Message[]) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Chat request failed");
  }
  const data = (await res.json()) as { content: string };
  return data.content;
}

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I’m TropiNord support. Ask me about products, shipping, or your order — I’ll do my best to help.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const canSend = useMemo(() => input.trim().length > 0 && !isSending, [input, isSending]);

  useEffect(() => {
    if (!open) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [open, messages.length]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isSending) return;

    setInput("");
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);

    try {
      setIsSending(true);
      const reply = await sendToBot(next.filter((m) => m.role !== "assistant" || m.content));
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry — I couldn’t connect to support right now. Please try again or email admin@tropinord.com.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="rounded-full h-12 w-12 p-0 shadow-lg" aria-label="Open chat">
            <MessageCircle className="h-5 w-5" />
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Customer support</DialogTitle>
          </DialogHeader>

          <div className="max-h-[55vh] overflow-auto rounded-md border bg-background p-3">
            <div className="space-y-3">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={
                    m.role === "user"
                      ? "flex justify-end"
                      : "flex justify-start"
                  }
                >
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[85%] rounded-2xl bg-primary text-primary-foreground px-3 py-2 text-sm"
                        : "max-w-[85%] rounded-2xl bg-muted px-3 py-2 text-sm"
                    }
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => {
                if (e.key === "Enter") void handleSend();
              }}
            />
            <Button onClick={() => void handleSend()} disabled={!canSend} aria-label="Send">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
