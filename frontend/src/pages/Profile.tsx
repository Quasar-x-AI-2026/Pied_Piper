import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

// --- Types ---
interface ProfileForm {
  phoneNumber: string;
  jobType: string;
  age: string;
  income: string;
  state: string;
  caste: string;
  gender: string;
  name: string;
  email: string;
}

const Profile = () => {
  const { token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const [form, setForm] = useState<ProfileForm>({
    phoneNumber: "",
    jobType: "",
    age: "",
    income: "",
    state: "",
    caste: "",
    gender: "",
    name: "",
    email: "",
  });

  // Backup state to revert changes if user cancels
  const [initialData, setInitialData] = useState<ProfileForm | null>(null);

  // --- Fetch Profile ---
  useEffect(() => {
    const fetchProfile = async () => {
      console.log("Fetching profile with token:", token);
      try {
        const res = await fetch(`${API_URL}/api/v1/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Profile fetch response:", res);
        if (!res.ok) throw new Error("Failed to fetch profile");
        
        const data = await res.json();
        console.log("Profile data:", data);
        if (data.success && data.data) {
          const formattedData = {
            ...data.data,
            age: data.data.age ? String(data.data.age) : "",
            income: data.data.income ? String(data.data.income) : "",
          };
          setForm(formattedData);
          setInitialData(formattedData);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        showToast("error", "Could not load profile data.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  // --- Helpers ---
  const showToast = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    if (initialData) setForm(initialData);
    setIsEditing(false);
  };

  const handleSave = async () => {
    // Basic Validation
    if (form.phoneNumber && !/^\d{10}$/.test(form.phoneNumber)) {
      return showToast("error", "Please enter a valid 10-digit phone number." );
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/v1/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          age: form.age ? Number(form.age) : undefined,
          income: form.income ? Number(form.income) : undefined,
        }),
      });

      if (!res.ok) throw new Error("Failed to update");

      setInitialData(form);
      setIsEditing(false);
      showToast("success", "Profile updated successfully!");
    } catch (err) {
      showToast("error", "Failed to save changes. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !initialData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container-app py-12 max-w-4xl animate-fade-in">
      {/* Toast Notification */}
      {message.text && (
        <div className={`fixed top-5 right-5 px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce ${
          message.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
        }`}>
          {message.text}
        </div>
      )}

      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Your Profile</h1>
          <p className="text-muted-foreground mt-1">
            Keep your details updated for personalized financial insights.
          </p>
        </div>

        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button onClick={handleCancel} className="btn-ghost border px-6 py-2 rounded-md hover:bg-secondary transition-all">
                Cancel
              </button>
              <button onClick={handleSave} disabled={loading} className="btn-primary bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-all">
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="btn-secondary bg-secondary px-6 py-2 rounded-md hover:brightness-95 transition-all">
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Main Content Card - Fixed Scrollability */}
      <div className="card-elevated bg-card border rounded-xl shadow-sm p-6 md:p-8 space-y-8 max-h-[75vh] overflow-y-hidden custom-scrollbar">
        
        <Section title="Basic Information">
          <Input label="Full Name" name="name" value={form.name} onChange={handleChange} disabled={!isEditing} placeholder="Enter your name" />
          <Input label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} disabled={true} />
          <Input label="Phone Number" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} disabled={!isEditing} placeholder="10-digit number" />
          <Select
            label="Job Type"
            name="jobType"
            value={form.jobType}
            onChange={handleChange}
            disabled={!isEditing}
            options={["Student", "Salaried", "Self-Employed", "Farmer", "Unemployed", "Retired", "Other"]}
          />
          <Input label="Age" name="age" type="number" value={form.age} onChange={handleChange} disabled={!isEditing} />
        </Section>

        <Section title="Financial Details">
          <Input label="Monthly Income (₹)" name="income" type="number" value={form.income} onChange={handleChange} disabled={!isEditing} />
          <Input label="State" name="state" value={form.state} onChange={handleChange} disabled={!isEditing} placeholder="e.g. Maharashtra" />
        </Section>

        <Section title="Demographics">
          <Select
            label="Caste Category"
            name="caste"
            value={form.caste}
            onChange={handleChange}
            disabled={!isEditing}
            options={["General", "OBC", "SC", "ST"]}
          />
          <Select
            label="Gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            disabled={!isEditing}
            options={["Male", "Female", "Other"]}
          />
        </Section>
      </div>
    </div>
  );
};

export default Profile;

// --- Sub-Components ---

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border-b pb-6 last:border-none last:pb-0">
    <h2 className="text-lg font-medium mb-4 text-primary">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {children}
    </div>
  </div>
);

const Input = ({ label, disabled, ...props }: any) => (
  <div className="flex flex-col space-y-1.5">
    <label className="text-sm font-medium text-muted-foreground">{label}</label>
    <input
      {...props}
      disabled={disabled}
      className={`p-2.5 rounded-md border bg-background transition-all focus:ring-2 focus:ring-blue-500 outline-none ${
        disabled ? "bg-muted/50 opacity-70 cursor-not-allowed" : "hover:border-primary"
      }`}
    />
  </div>
);

const Select = ({ label, options, disabled, ...props }: any) => (
  <div className="flex flex-col space-y-1.5">
    <label className="text-sm font-medium text-muted-foreground">{label}</label>
    <select
      {...props}
      disabled={disabled}
      className={`p-2.5 rounded-md border bg-background transition-all focus:ring-2 focus:ring-blue-500 outline-none ${
        disabled ? "bg-muted/50 opacity-70 cursor-not-allowed" : "hover:border-primary cursor-pointer"
      }`}
    >
      <option value="">Select Option</option>
      {options.map((o: string) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  </div>
);