"use client";

type Props = {
  onClose: () => void;
};

export default function PaidEntryModal({ onClose }: Props) {
  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h2>Paid Entry Request</h2>

        <p style={{ opacity: 0.7 }}>
          Submit your profile to get featured in the roulette.
        </p>

        <input
          type="text"
          placeholder="Your X / Farcaster profile link"
          style={{ width: "100%", padding: 12, marginTop: 12 }}
        />

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={onClose}>Cancel</button>
          <button>Pay & Submit</button>
        </div>
      </div>
    </div>
  );
}