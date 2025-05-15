// src/app/api/secure-endpoint/[submissionId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma  from '../../../../server/db/prisma';
import { ApiResponse } from '@/types';

// Use the hardcoded token for simplicity
const API_TOKEN = process.env.API_TOKEN || 'pabbly_api_token_12345';

export async function GET(
  request: NextRequest,
  { params }: { params: { submissionId: string } }
) {
  try {
    // Verify authentication token
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Missing or invalid authentication token' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (token !== API_TOKEN) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Get submission ID from URL parameter
    const { submissionId } = params;
    
    if (!submissionId) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Submission ID is required' },
        { status: 400 }
      );
    }
    
    // Retrieve the submission from database
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId }
    });
    
    if (!submission) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: 'Submission not found' },
        { status: 404 }
      );
    }
    
    console.log('Processing submission:', submission);
    
    // Mark as processed
    await prisma.submission.update({
      where: { id: submissionId },
      data: { processedAt: new Date() }
    });
    
    // Return a valid JSON response
    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Form data processed successfully',
      data: {
        email: submission.email,
        submittedAt: submission.createdAt.toISOString(),
        processedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('API error:', error);
    
    return NextResponse.json<ApiResponse>(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}