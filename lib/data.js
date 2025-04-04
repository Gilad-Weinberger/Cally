// Testimonial data for the carousel

export const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Marketing Director",
    company: "TechCorp",
    rating: 5,
    text: "Caly has completely transformed how I manage my schedule. The AI suggestions are spot-on and I've never been more productive!"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Software Engineer",
    company: "DevStream",
    rating: 5,
    text: "As a developer with multiple projects, Caly helps me stay on track. The natural language processing for scheduling is incredibly intuitive."
  },
  {
    id: 3,
    name: "Jessica Williams",
    role: "Freelance Designer",
    company: "Creative Solutions",
    rating: 5,
    text: "Caly is a game-changer for freelancers! I can easily manage client meetings and personal time without any scheduling conflicts."
  },
  {
    id: 4,
    name: "David Rodriguez",
    role: "Project Manager",
    company: "BuildRight",
    rating: 5,
    text: "My team's coordination has improved significantly since we started using Caly. The shared calendar features are exceptional."
  },
  {
    id: 5,
    name: "Emma Thompson",
    role: "CEO",
    company: "Innovate Inc.",
    rating: 5,
    text: "As a CEO, my time is precious. Caly's AI assistant understands my priorities and helps me focus on what truly matters."
  },
  {
    id: 6,
    name: "Robert Kim",
    role: "Medical Doctor",
    company: "Health Partners",
    rating: 5,
    text: "Managing patient appointments has never been easier. Caly's intuitive interface saves me hours every week."
  },
  {
    id: 7,
    name: "Olivia Martinez",
    role: "Event Planner",
    company: "Perfect Events",
    rating: 5,
    text: "The color-coding system in Caly helps me visualize my event schedule at a glance. It's been essential for my business growth."
  },
  {
    id: 8,
    name: "James Wilson",
    role: "University Professor",
    company: "State University",
    rating: 5,
    text: "Balancing lectures, office hours, and research is complex. Caly simplifies my academic life with its smart scheduling features."
  }
];

export const pricingPlans = [
  {
    name: 'Free',
    description: 'Basic calendar features to get you started',
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      'Basic calendar management',
      'Up to 3 events per day',
      'Limited AI suggestions',
      'Email notifications'
    ],
    cta: 'Get Started',
    ctaLink: '/auth/signup',
    highlighted: false,
    aiFeatures: 'Limited'
  },
  {
    name: 'Pro',
    description: 'Advanced AI features for individuals',
    monthlyPrice: 9.99,
    annualPrice: 99.99,
    features: [
      'Everything in Free',
      'Unlimited AI scheduling',
      'Task prioritization',
      'Smart reminders',
      'Calendar analytics'
    ],
    cta: 'Start Free Trial',
    ctaLink: '/auth/signup?plan=pro',
    highlighted: true,
    badge: 'Most Popular',
    aiFeatures: 'Advanced'
  },
  {
    name: 'Teams',
    description: 'Powerful tools for teams and businesses',
    monthlyPrice: 19.99,
    annualPrice: 199.99,
    features: [
      'Everything in Pro',
      'Team scheduling',
      'Shared calendars',
      'Admin controls',
      'API access',
      'Priority support'
    ],
    cta: 'Contact Sales',
    ctaLink: '/contact',
    highlighted: false,
    aiFeatures: 'Enterprise-grade'
  }
];