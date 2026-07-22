"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
// Assuming there will be a server action or API for this. We will simulate for demo.

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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSubmitted(true);
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="mt-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-xl border border-green-100 dark:border-green-800 text-sm font-medium">
        ✓ Thank you for your review!
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 space-y-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl"
    >
      <h4 className="font-medium text-sm text-gray-900 dark:text-white">
        Review {productName}
      </h4>

      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          Rating
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="text-2xl focus:outline-none transition-colors"
            >
              <span
                className={
                  star <= rating
                    ? "text-amber-400"
                    : "text-gray-300 dark:text-gray-600"
                }
              >
                ★
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          Comment
        </label>
        <textarea
          name="comment"
          required
          rows={2}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          placeholder="What did you think of this product?"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
