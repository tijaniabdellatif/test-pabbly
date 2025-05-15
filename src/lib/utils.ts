import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

const WEBHOOK_URL =
  process.env.PABBLY_WEBHOOK_URL ||
  "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjYwNTY4MDYzMTA0MzE1MjY4NTUzNTUxMzIi_pc";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// src/lib/utils.ts
// ...existing code...

/**
 * Safely send a request to Pabbly webhook
 */
export async function notifyPabbly(submissionId: string) {
  const webhookUrl = process.env.PABBLY_WEBHOOK_URL;
  
  if (!webhookUrl) {
    throw new Error('Pabbly webhook URL is not configured');
  }
  
  // Use the fetch API which works in both Node.js and Edge environments
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: true,
      timestamp: new Date().toISOString(),
      submissionId,
      metadata: {
        source: 'nextjs-app',
        event: 'form_submission'
      }
    }),
  });
  
  // Log the response status
  console.log('Pabbly webhook response status:', response.status);
  
  // Try to parse the response body
  let responseBody: any;
  try {
    responseBody = await response.text();
    console.log('Pabbly webhook response body:', responseBody);
    
    // Try to parse as JSON if possible
    try {
      responseBody = JSON.parse(responseBody);
    } catch {
      // If it's not JSON, keep it as text
    }
  } catch (error) {
    console.log('Failed to read Pabbly webhook response:', error);
  }
  
  if (!response.ok) {
    throw new Error(`Failed to notify Pabbly: ${response.status} ${response.statusText}`);
  }
  
  return responseBody;
}
