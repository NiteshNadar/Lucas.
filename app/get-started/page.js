import { Suspense } from "react";
import GetStartedClient from "./GetStartedClient";

export const metadata = {
  title: "Get Started - Custom Automation Audit | Lucas Automation",
  description: "Take the first step to putting your business on autopilot. Tell us about your workflow, the tools you use, and where your team wastes hours.",
};

export default function GetStartedPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-primary)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <i className="ph ph-spinner animate-spin" style={{ fontSize: '2rem' }} aria-hidden="true" />
          <span style={{ fontWeight: '500' }}>Loading wizard...</span>
        </div>
      </div>
    }>
      <GetStartedClient />
    </Suspense>
  );
}
