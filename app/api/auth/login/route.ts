import { NextRequest, NextResponse } from 'next/server';
import { authConfig } from '../../../../lib/config';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  error?: string;
  user?: {
    email: string;
    name: string;
  };
}

// POST /api/auth/login - Authenticate user
export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json<LoginResponse>(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check credentials against environment variables
    if (email !== authConfig.email || password !== authConfig.password) {
      return NextResponse.json<LoginResponse>(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Return success with user data
    const user = {
      email: email,
      name: 'Admin User'
    };

    return NextResponse.json<LoginResponse>({
      success: true,
      user
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json<LoginResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
