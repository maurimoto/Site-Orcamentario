import { useEffect, useState } from "react";

interface Plan {
  id: number;
  name: string;
  slug: string;
  description: string;
  price_monthly: number;
  max_quotes_per_month: number | null;
  features: string;
  is_active: number;
}

interface Subscription {
  id: number;
  user_id: string;
  plan_id: number;
  status: string;
  started_at: string;
  expires_at: string | null;
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = async () => {
    try {
      const response = await fetch("/api/subscriptions/me");
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);

        if (data?.plan_id) {
          const plansResponse = await fetch("/api/plans");
          if (plansResponse.ok) {
            const plans = await plansResponse.json();
            const currentPlan = plans.find((p: Plan) => p.id === data.plan_id);
            setPlan(currentPlan || null);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  return { subscription, plan, loading, refetch: fetchSubscription };
}
