import { useState } from "react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    phoneNumber: "",
    jobType: "",
    age: "",
    income: "",
    state: "",
    caste: "",
    gender: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // TODO: connect backend API to save profile
    setIsEditing(false);
  };

  return (
    <div className="container-app py-12 max-w-4xl animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Your Profile</h1>
          <p className="text-muted-foreground mt-1">
            Help us personalize schemes and financial insights for you.
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-secondary px-6 py-2"
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="btn-primary px-6 py-2"
          >
            Save Changes
          </button>
        )}
      </div>

      <div className="card-elevated p-6 md:p-8 space-y-8 max-h-[70vh] overflow-y-auto scrollbar-thin">
        <Section title="Basic Information">
          <Input
            label="Phone Number"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <Select
            label="Job Type"
            name="jobType"
            value={form.jobType}
            onChange={handleChange}
            disabled={!isEditing}
            options={[
              "Student",
              "Salaried",
              "Self-Employed",
              "Farmer",
              "Unemployed",
              "Retired",
              "Other",
            ]}
          />

          <Input
            label="Age"
            name="age"
            type="number"
            value={form.age}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </Section>

        <Section title="Financial Details">
          <Input
            label="Monthly Income"
            name="income"
            type="number"
            value={form.income}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <Input
            label="State"
            name="state"
            value={form.state}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </Section>

        <Section title="Demographics">
          <Select
            label="Caste"
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

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <h2 className="text-lg font-medium mb-4">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {children}
    </div>
  </div>
);

const Input = ({ label, disabled, ...props }: any) => (
  <div className="space-y-1">
    <label className="text-sm text-muted-foreground">{label}</label>
    <input
      {...props}
      disabled={disabled}
      className={`input-clean ${
        disabled ? "opacity-70 cursor-not-allowed" : ""
      }`}
    />
  </div>
);

const Select = ({ label, options, disabled, ...props }: any) => (
  <div className="space-y-1">
    <label className="text-sm text-muted-foreground">{label}</label>
    <select
      {...props}
      disabled={disabled}
      className={`input-clean ${
        disabled ? "opacity-70 cursor-not-allowed" : ""
      }`}
    >
      <option value="">Select</option>
      {options.map((o: string) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </div>
);
