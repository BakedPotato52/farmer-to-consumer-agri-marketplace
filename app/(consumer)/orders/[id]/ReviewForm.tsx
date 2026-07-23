"use client";

import { useState } from "react";
import { FaStar } from "react-icons/fa6";

export default function ReviewForm({
  orderId,
  productId,
  farmerId,
  productName,
}: {
  orderId: string;
  productId: string;
  farmerId: string;
  productName: string;
}) {
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const comment = formData.get("comment");

    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmerId,
          productId,
          rating,
          comment,
        }),
      });
    } catch {
      // Fallback for demo
    }

    setSubmitted(true);
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="mt-3 p-3 bg-secondary-container text-on-secondary-container rounded-xl text-xs font-semibold flex items-center gap-1.5">
        <span className="material-symbols-outlined text-[16px]">check_circle</span>
        Thank you for reviewing {productName}!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 p-4 bg-surface-container-low rounded-xl border border-outline-variant/15 space-y-3">
      <h4 className="font-heading font-bold text-xs text-primary uppercase tracking-wider">
        Leave a Review for {productName}
      </h4>

      <div>
        <label className="block text-xs text-outline mb-1">Rating</label>
        <div className="flex gap-1 text-amber-500">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: star <= rating ? "'FILL' 1" : "'FILL' 0" }}
              >
                <FaStar />
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs text-outline mb-1">Comment</label>
        <textarea
          name="comment"
          required
          rows={2}
          className="w-full px-3 py-2 rounded-lg bg-white border border-outline-variant/30 text-xs focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline outline-none"
          placeholder="How was the quality and freshness of this produce?"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:bg-primary-container transition-all disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
