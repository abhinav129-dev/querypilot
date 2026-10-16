import type { Metadata } from "next";
import { WorkspaceApp } from "@/components/workspace/workspace-app";

export const metadata: Metadata = {
  title: "Workspace",
};

export default function Page() {
  return <WorkspaceApp />;
}
