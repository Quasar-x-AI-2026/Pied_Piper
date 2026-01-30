import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Wallet,
  LineChart,
  AlertTriangle,
  BadgeCent,
} from "lucide-react";

const Home = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      
      {/* Top Right Sign In */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={() => navigate("/auth")}
          className="btn-secondary px-5 py-2"
        >
          Sign In
        </button>
      </div>

      {/* HERO */}
      <section className="container-app pt-28 pb-20 text-center">
        <p className="text-primary tracking-widest font-semibold text-2xl">
          FINGUARD AI
        </p>

        <h1 className="mt-4 text-4xl md:text-5xl font-bold">
          Meet your <span className="text-primary">AI financial assistant</span>
        </h1>

        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          FinGuard keeps an eye on your spending, savings, government benefits,
          and financial risks — so you don’t have to.
        </p>

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => navigate("/app")}
            className="btn-primary px-10 py-4 text-lg"
          >
            Get Started
          </button>
        </div>
      </section>

      <section className="container-app pb-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <InfoCard title="What FinGuard AI can do">
            <InfoItem
              icon={<Wallet size={18} />}
              text="Track your spending and highlight overspending early"
            />
            <InfoItem
              icon={<LineChart size={18} />}
              text="Help you plan budgets and build emergency savings"
            />
            <InfoItem
              icon={<ShieldCheck size={18} />}
              text="Explain government schemes and check eligibility"
            />
            <InfoItem
              icon={<AlertTriangle size={18} />}
              text="Detect suspicious messages and financial scams"
            />
            <InfoItem
              icon={<BadgeCent size={18}/>}
              text="Teach & guide you in personal finance"
            />
          </InfoCard>

          <InfoCard title="Designed for your life">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Whether you’re a salaried professional, student, farmer, freelancer, or senior citizen, FinGuard adapts personalized insights, budgeting tips, and government scheme recommendations to your income, lifestyle, and financial goals—so guidance always fits your reality.
            </p>
          </InfoCard>

        </div>
      </section>
    </div>
  );
};

export default Home;


const InfoCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="card-elevated p-6">
    <h3 className="mb-4 text-lg font-semibold">{title}</h3>
    {children}
  </div>
);

const InfoItem = ({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) => (
  <div className="flex items-start gap-3 text-sm text-muted-foreground mb-3">
    <div className="mt-0.5 text-primary">{icon}</div>
    <span>{text}</span>
  </div>
);
