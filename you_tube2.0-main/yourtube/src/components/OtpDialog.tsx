import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosinstance";
import { useUser } from "@/lib/AuthContext";

interface Props {
  open: boolean;
  userId: string;
  onClose: () => void;
}

export default function OtpDialog({
  open,
  userId,
  onClose,
}: Props) {
  const { login } = useUser();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setOtp("");
    }
  }, [open]);

  if (!open) return null;

  const verifyOtp = async () => {
    if (!otp.trim()) {
      alert("Please enter OTP");
      return;
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post("/user/verify-otp", {
        userId,
        otp,
      });

      login(res.data.result);

      alert("OTP Verified Successfully!");

      setOtp("");
      onClose();
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          "Invalid or Expired OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">
          Verify OTP
        </h2>

        <p className="text-sm text-gray-600 mb-3 text-center">
          Enter the OTP sent to your registered email.
        </p>

        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit OTP"
          className="border p-2 w-full rounded outline-none"
        />

        <button
          onClick={verifyOtp}
          disabled={loading}
          className="mt-4 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <button
          onClick={onClose}
          className="mt-2 w-full border py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}