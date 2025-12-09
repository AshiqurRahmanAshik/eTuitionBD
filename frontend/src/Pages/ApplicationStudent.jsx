import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { motion } from "framer-motion";
import api from "../utils/api";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Payment Form Component
const PaymentForm = ({ application, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      // Create payment intent
      const intentRes = await api.post("/api/payments/create-intent", {
        amount: application.expectedSalary,
      });

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        intentRes.data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (error) {
        setError(error.message);
        setProcessing(false);
        return;
      }

      // Confirm in backend and approve application
      await api.post("/api/payments/confirm", {
        application_id: application._id,
        tuition_id: application.tuition_id,
        tutor_id: application.tutor_id,
        amount: application.expectedSalary,
        transactionId: paymentIntent.id,
      });

      alert("Payment successful! Application approved.");
      onSuccess();
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.response?.data?.message || "Payment failed");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="label">
          <span className="label-text font-semibold">
            Amount: ৳{application.expectedSalary}
          </span>
        </label>
        <CardElement
          className="p-3 border border-gray-300 rounded-lg"
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
            },
          }}
        />
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      <div className="modal-action">
        <button
          type="submit"
          className={`btn btn-primary ${processing ? "loading" : ""}`}
          disabled={processing || !stripe}
        >
          {processing ? "Processing..." : "Pay Now"}
        </button>
        <button type="button" className="btn" onClick={onCancel} disabled={processing}>
          Cancel
        </button>
      </div>
    </form>
  );
};

const ApplicationsStudent = () => {
  const [searchParams] = useSearchParams();
  const tuitionId = searchParams.get("tuitionId");
  
  const [myTuitions, setMyTuitions] = useState([]);
  const [selectedTuitionId, setSelectedTuitionId] = useState(tuitionId || "");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    fetchMyTuitions();
  }, []);

  useEffect(() => {
    if (selectedTuitionId) {
      fetchApplications(selectedTuitionId);
    }
  }, [selectedTuitionId]);

  const fetchMyTuitions = async () => {
    try {
      const response = await api.get("/api/tuitions/student/my-tuitions");
      setMyTuitions(response.data.tuitions);
      
      // If tuitionId from URL, set it
      if (tuitionId) {
        setSelectedTuitionId(tuitionId);
      } else if (response.data.tuitions.length > 0) {
        setSelectedTuitionId(response.data.tuitions[0]._id);
      }
    } catch (error) {
      console.error("Error fetching tuitions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (tuitionId) => {
    try {
      const response = await api.get(`/api/applications/tuition/${tuitionId}`);
      setApplications(response.data.applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const handleApprove = (application) => {
    setSelectedApplication(application);
    setShowPaymentModal(true);
  };

  const handleReject = async (applicationId) => {
    if (!confirm("Are you sure you want to reject this application?")) return;

    try {
      await api.patch(`/api/applications/${applicationId}/reject`);
      alert("Application rejected successfully!");
      fetchApplications(selectedTuitionId);
    } catch (error) {
      console.error("Error rejecting application:", error);
      alert(error.response?.data?.message || "Failed to reject application");
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setSelectedApplication(null);
    fetchApplications(selectedTuitionId);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "badge-warning",
      approved: "badge-success",
      rejected: "badge-error",
    };
    return badges[status] || "badge-ghost";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (myTuitions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-500 mb-4">
          You don't have any tuitions yet
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">Applications</h1>
        <p className="text-gray-600">Review and manage tutor applications</p>
      </motion.div>

      {/* Tuition Selector */}
      <div className="form-control mb-6">
        <label className="label">
          <span className="label-text font-semibold">Select Tuition</span>
        </label>
        <select
          className="select select-bordered w-full max-w-xs"
          value={selectedTuitionId}
          onChange={(e) => setSelectedTuitionId(e.target.value)}
        >
          {myTuitions.map((tuition) => (
            <option key={tuition._id} value={tuition._id}>
              {tuition.subject} - {tuition.class}
            </option>
          ))}
        </select>
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">No applications yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {applications.map((application) => (
            <motion.div
              key={application._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card bg-base-100 shadow-xl"
            >
              <div className="card-body">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="card-title">Tutor Application</h2>
                  <div className={`badge ${getStatusBadge(application.status)}`}>
                    {application.status}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="font-semibold">Qualifications:</p>
                    <p className="text-gray-700">{application.qualifications}</p>
                  </div>

                  <div>
                    <p className="font-semibold">Experience:</p>
                    <p className="text-gray-700">{application.experience}</p>
                  </div>

                  <div>
                    <p className="font-semibold">Expected Salary:</p>
                    <p className="text-lg text-primary font-bold">
                      ৳{application.expectedSalary}/month
                    </p>
                  </div>

                  <div className="text-sm text-gray-500">
                    Applied on {new Date(application.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {application.status === "pending" && (
                  <div className="card-actions justify-end mt-4">
                    <button
                      onClick={() => handleApprove(application)}
                      className="btn btn-success"
                    >
                      Approve & Pay
                    </button>
                    <button
                      onClick={() => handleReject(application._id)}
                      className="btn btn-error"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedApplication && (
        <div className="modal modal-open">
          <div className="modal-box max-w-lg">
            <h3 className="font-bold text-lg mb-4">Complete Payment</h3>
            <Elements stripe={stripePromise}>
              <PaymentForm
                application={selectedApplication}
                onSuccess={handlePaymentSuccess}
                onCancel={() => {
                  setShowPaymentModal(false);
                  setSelectedApplication(null);
                }}
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsStudent;