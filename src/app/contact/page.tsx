'use client';

import { useState } from 'react';
import { Mail, Phone, Clock, MapPin, CheckCircle2, Send, Sparkles } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'Personal Styling Consultation',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="border-b border-[#E9E2D8] pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#702C3B]">
          <Mail className="w-4 h-4" />
          <span>Client Concierge</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
          Contact Concierge &amp; Private Atelier
        </h1>
        <p className="text-xs text-stone-500">
          Inquire regarding custom tailoring appointments, order logistics, or portfolio partnerships.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#E9E2D8] p-6 rounded-sm space-y-4">
            <h3 className="font-serif text-xl font-medium text-stone-900 pb-2 border-b border-[#E9E2D8]">
              Atelier Coordinates
            </h3>

            <div className="space-y-4 text-xs text-stone-700">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#702C3B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono uppercase text-stone-400 text-[10px] block">Digital Concierge</span>
                  <a href={`mailto:${SITE_CONFIG.contact.email}`} className="font-medium hover:text-[#702C3B]">
                    {SITE_CONFIG.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#702C3B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono uppercase text-stone-400 text-[10px] block">Telephone Assistance</span>
                  <span className="font-mono">{SITE_CONFIG.contact.phone}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#702C3B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono uppercase text-stone-400 text-[10px] block">Atelier Operating Hours</span>
                  <span>{SITE_CONFIG.contact.hours}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#702C3B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono uppercase text-stone-400 text-[10px] block">Studio Location</span>
                  <span>Nariman Point Atelier &amp; Showroom, Mumbai, India (Demo)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#171717] text-white p-6 rounded-sm space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#B6A99A]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Agency Attribution</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed font-light">
              Designed &amp; Developed by <strong>{SITE_CONFIG.creator.name}</strong> as an elite fashion e-commerce showcase.
            </p>
            <a
              href={SITE_CONFIG.creator.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs font-mono text-[#E9E2D8] hover:text-white underline underline-offset-4 pt-1"
            >
              Explore Infinvo Tech Portfolio →
            </a>
          </div>
        </div>

        {/* Right: Message Form */}
        <div className="lg:col-span-7 bg-white border border-[#E9E2D8] p-6 sm:p-8 rounded-sm space-y-6">
          <div className="border-b border-[#E9E2D8] pb-3">
            <h3 className="font-serif text-xl font-medium text-stone-900">
              Send Concierge Inquiry
            </h3>
            <p className="text-xs text-stone-500">
              Our styling specialists typically reply within 2 business hours.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xs space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h4 className="font-serif text-base font-semibold">Message Dispatched</h4>
              </div>
              <p className="text-xs text-emerald-700 leading-relaxed">
                Thank you, {form.name}. Your inquiry has been routed to our private concierge team.
                A confirmation copy has been sent to {form.email}.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: '', email: '', subject: 'Personal Styling Consultation', message: '' });
                }}
                className="mt-2 text-xs font-mono text-emerald-900 underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono uppercase text-stone-600 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Rohini Roy"
                    className="w-full bg-[#F8F6F1] border border-[#E9E2D8] p-2.5 rounded-xs focus:outline-none focus:border-[#702C3B]"
                  />
                </div>
                <div>
                  <label className="block font-mono uppercase text-stone-600 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="e.g. rohini@example.com"
                    className="w-full bg-[#F8F6F1] border border-[#E9E2D8] p-2.5 rounded-xs focus:outline-none focus:border-[#702C3B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono uppercase text-stone-600 mb-1">Inquiry Purpose</label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full bg-[#F8F6F1] border border-[#E9E2D8] p-2.5 rounded-xs focus:outline-none focus:border-[#702C3B]"
                >
                  <option value="Personal Styling Consultation">Personal Styling Consultation</option>
                  <option value="Bespoke Sizing & Fit Guidance">Bespoke Sizing &amp; Fit Guidance</option>
                  <option value="Simulated Order Inquiries">Simulated Order Inquiries</option>
                  <option value="Corporate / Gifting Curation">Corporate / Gifting Curation</option>
                  <option value="Technical / Agency Showcase">Technical / Agency Showcase</option>
                </select>
              </div>

              <div>
                <label className="block font-mono uppercase text-stone-600 mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Detail your request, sizing questions, or styling objectives..."
                  className="w-full bg-[#F8F6F1] border border-[#E9E2D8] p-2.5 rounded-xs focus:outline-none focus:border-[#702C3B]"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs font-mono uppercase tracking-widest font-semibold rounded-xs transition-colors flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
