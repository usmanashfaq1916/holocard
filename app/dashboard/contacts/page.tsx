"use client";

import { useEffect, useState } from "react";
import { Search, Users, UserPlus, Mail, Phone, CreditCard } from "lucide-react";

interface Contact {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  createdAt: string;
  card: {
    name: string;
    slug: string;
  };
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/contacts")
      .then((r) => r.json())
      .then((data) => {
        setContacts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = contacts.filter((c) => {
    const q = search.toLowerCase();
    return (
      !q ||
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Contacts</h1>
          <p className="text-sm text-muted-foreground">
            People who saved their contact through your cards.
          </p>
        </div>
        <div className="glass flex items-center gap-2 rounded-lg px-3 py-2">
          <UserPlus className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{contacts.length}</span>
          <span className="text-xs text-muted-foreground">total</span>
        </div>
      </div>

      <div className="glass rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {loading ? (
        <div className="glass rounded-xl overflow-hidden">
          <div className="p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 border-b border-border py-3 last:border-0"
              >
                <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-48 animate-pulse rounded bg-muted" />
                </div>
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass flex flex-col items-center justify-center rounded-xl p-12">
          <Users className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 font-semibold">
            {contacts.length === 0 ? "No contacts yet" : "No results found"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {contacts.length === 0
              ? "Contacts will appear here when people save their info from your cards."
              : "Try a different search term."}
          </p>
        </div>
      ) : (
        <div className="glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Card</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((contact) => (
                  <tr
                    key={contact.id}
                    className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan text-xs font-bold text-white">
                          {contact.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2) || "?"}
                        </div>
                        <span className="font-medium">
                          {contact.name || "Anonymous"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {contact.email ? (
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3 w-3" />
                          {contact.email}
                        </div>
                      ) : (
                        <span className="text-muted-foreground/50">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {contact.phone ? (
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3 w-3" />
                          {contact.phone}
                        </div>
                      ) : (
                        <span className="text-muted-foreground/50">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <CreditCard className="h-3 w-3" />
                        {contact.card.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
