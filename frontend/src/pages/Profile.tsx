import { useState } from "react";

const Profile = () => {
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

  return (
    <div className="container-app py-12 max-w-4xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Your Profile</h1>
        <p className="text-muted-foreground mt-1">
          Help us personalize schemes and financial insights for you.
        </p>
      </div>

      <div className="card-elevated p-6 md:p-8 space-y-8 max-h-[70vh] overflow-y-auto scrollbar-thin">
        <Section title="Basic Information">
          <Input
            label="Phone Number"
            name="phoneNumber"
            placeholder="Enter mobile number"
            onChange={handleChange}
          />

          <Select
            label="Job Type"
            name="jobType"
            onChange={handleChange}
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
            placeholder="Your age"
            onChange={handleChange}
          />
        </Section>

        <Section title="Financial Details">
          <Input
            label="Monthly Income"
            name="income"
            type="number"
            placeholder="₹ Amount"
            onChange={handleChange}
          />
          <Input
            label="State"
            name="state"
            placeholder="Your state"
            onChange={handleChange}
          />
        </Section>

        <Section title="Demographics">
          <Select
            label="Caste"
            name="caste"
            onChange={handleChange}
            options={["General", "OBC", "SC", "ST"]}
          />
          <Select
            label="Gender"
            name="gender"
            onChange={handleChange}
            options={["Male", "Female", "Other"]}
          />
        </Section>

        <div className="pt-4 flex justify-end">
          <button className="btn-primary px-8 py-3">
            Save Profile
          </button>
        </div>
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

const Input = ({ label, ...props }: any) => (
  <div className="space-y-1">
    <label className="text-sm text-muted-foreground">{label}</label>
    <input {...props} className="input-clean" />
  </div>
);

const Select = ({ label, options, ...props }: any) => (
  <div className="space-y-1">
    <label className="text-sm text-muted-foreground">{label}</label>
    <select {...props} className="input-clean">
      <option value="">Select</option>
      {options.map((o: string) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </div>
);
