"use client";
import { useEffect, useState } from "react";

type ConfirmModalProps = {
  onConfirm: () => void;
  onClose: () => void;
};

export default function ConfirmModal({ onConfirm, onClose }: ConfirmModalProps) {
  const [seconds, setSeconds] = useState(3);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  return (
    <div className="confirm-overlay">
      <div className="confirm-card">
        <h2>Confirm Task Completion</h2>
        <p>Please confirm that you have completed the task.</p>

        <div className="count-container">
          {seconds > 0 ? (
            <>
              <span className="count-number">{seconds}</span>
              <span className="count-text">
                SECONDS REMAINING
              </span>
            </>
          ) : (
            <span className="ready-text">
              Ready to confirm!
            </span>
          )}
        </div>

        <div className="confirm-actions">
          <button className="btn-close" onClick={onClose}>
            Close
          </button>

          <button
            className="btn-confirm"
            disabled={seconds > 0}
            onClick={onConfirm}
          >
            ✓ Check
          </button>
        </div>
      </div>
    </div>
  );
}