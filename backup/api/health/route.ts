import { NextResponse } from 'next/server';
import { checkEnvironmentVariables } from '@/lib/checkEnv';

/**
 * 🏥 Health Check Endpoint
 * 
 * Проверяет статус системы и переменных окружения
 */
export async function GET() {
  const envCheck = checkEnvironmentVariables();
  
  const response = {
    status: envCheck.isValid ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    checks: {
      environmentVariables: {
        status: envCheck.isValid ? 'pass' : 'fail',
        details: envCheck.details,
        missing: envCheck.missing,
        invalid: envCheck.invalid,
        warnings: envCheck.warnings
      },
      api: {
        status: 'pass',
        message: 'API is responding'
      }
    }
  };
  
  // В production не показываем детали, если всё ок
  if (process.env.NODE_ENV === 'production' && envCheck.isValid) {
    return NextResponse.json({
      status: 'healthy',
      timestamp: response.timestamp,
      message: 'All systems operational'
    });
  }
  
  const statusCode = envCheck.isValid ? 200 : 503;
  
  return NextResponse.json(response, { status: statusCode });
}

