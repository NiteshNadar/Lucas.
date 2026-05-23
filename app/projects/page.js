import ProjectsClient from "./ProjectsClient";

export const metadata = {
  title: "Our Work & Projects | Lucas Automation",
  description: "Explore the simple setups we built to save time and do manual work for you.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    type: "website",
    title: "Our Work & Projects | Lucas Automation",
    description: "Explore the simple setups we built to save time and do manual work for you.",
    url: "/projects",
  },
};

const allProjects = [
  {
    title: "AI Wedding Cards",
    description: "Makes custom digital invite cards and sends them instantly on WhatsApp.",
    image: "/Digital Invitation Card.jpeg",
  },
  {
    title: "Website Lead Tracker",
    description: "Saves website sign-ups to Google Sheets and sends you instant alerts.",
    image: "/Website lead Automation.jpeg",
  },
  {
    title: "Wellness Coach Bot",
    description: "Asks quick health questions and emails personalized wellness advice.",
    image: "/Wellness_survey_and_report_card.jpeg",
  },
  {
    title: "Smart Document Reader",
    description: "Searches your Google Drive to answer questions about your business.",
    image: "/AI_assistant_knowledge_retrieval.jpeg",
  },
  {
    title: "LinkedIn Auto-Poster",
    description: "Finds trending topics, writes posts, and auto-publishes to LinkedIn.",
    image: "/AI_LinkedIn_posting_automation_.jpeg",
  },
  {
    title: "Gym Payment Reminders",
    description: "Tracks gym memberships and sends automated WhatsApp payment reminders.",
    image: "/Gym_automation_product.jpeg",
  },
  {
    title: "Food Nutrition Analyzer",
    description: "Scans photos of food to estimate calories and list healthy nutrients.",
    image: "/Hand_scanning_food_nutrition_app_.jpeg",
  },
  {
    title: "Smart Feedback Routing",
    description: "Reads customer reviews and instantly sends complaints to the right person.",
    image: "/Business_automation_customer_feedback.jpeg",
  }
];

export default function ProjectsPage() {
  return <ProjectsClient allProjects={allProjects} />;
}
