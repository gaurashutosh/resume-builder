import React from "react";
import { Quote, Star } from "lucide-react";
import Title from "./Title";

const Testimonials = () => {
  const testimonials = [
    {
      image:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
      name: "Briar Martin",
      handle: "@neilstellar",
      content:
        "This builder made undercutting all of our competitors an absolute breeze. Highly recommended!",
    },
    {
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
      name: "Avery Johnson",
      handle: "@averywrites",
      content:
        "The AI suggested improvements actually make sense. I landed 3 interviews in one week.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60",
      name: "Jordan Lee",
      handle: "@jordantalks",
      content:
        "Professional templates that don't look generic. Exactly what I was looking for.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60",
      name: "Sarah Chen",
      handle: "@sarah.codes",
      content:
        "Clean, fast, and efficient. The PDF export is flawless and ATS-friendly.",
    },
  ];

  const TestimonialCard = ({ testimonial }) => (
    <div className="group p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 w-80 shrink-0 mx-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-3 items-center">
          <img
            className="size-12 rounded-full ring-2 ring-slate-50 transition-transform group-hover:scale-110"
            src={testimonial.image}
            alt={testimonial.name}
            loading="lazy"
          />
          <div>
            <p className="font-bold text-slate-900 leading-none mb-1">
              {testimonial.name}
            </p>
            <span className="text-xs text-slate-500">{testimonial.handle}</span>
          </div>
        </div>
        <div className="text-green-500">
          <Quote size={20} fill="currentColor" opacity={0.2} />
        </div>
      </div>

      <div className="flex gap-1 text-amber-400">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} fill="currentColor" />
        ))}
      </div>

      <p className="text-slate-600 text-sm leading-relaxed italic">
        "{testimonial.content}"
      </p>
    </div>
  );

  return (
    <section id="testimonials" className="py-24 overflow-hidden">
      <div className="container mx-auto px-6 mb-16 flex flex-col items-center">
        <div className="flex items-center gap-2 text-sm font-semibold text-green-700 bg-green-100 rounded-full px-6 py-2 mb-4">
          <span>Testimonials</span>
        </div>

        <Title
          title="Don't just take our word for it"
          description="Join 10,000+ professionals who trust our platform for their career growth."
        />
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 h-full w-32 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent"></div>
        <div className="absolute right-0 top-0 h-full w-32 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent"></div>

        {/* Row 1 */}
        <div className="flex overflow-hidden group">
          <div className="flex animate-marquee hover-pause py-4">
            {[...testimonials, ...testimonials].map((t, i) => (
              <TestimonialCard key={`t1-${i}`} testimonial={t} />
            ))}
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex overflow-hidden group mt-6">
          <div className="flex animate-marquee-reverse hover-pause py-4">
            {[...testimonials, ...testimonials].map((t, i) => (
              <TestimonialCard key={`t2-${i}`} testimonial={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
