import { GET } from './route' // Only GET is defined in the route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Mock the next/server NextResponse
// Note: The mock returns an object with a `json()` method that returns a promise,
// mimicking the standard Response API for use with `await response.json()`.
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, init) => {
      const status = init?.status || 200
      return {
        json: () => Promise.resolve(data),
        status: status,
      }
    }),
  },
}))

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn((tableName: string) => {
      // Optionally, you can assert or store tableName here for further checks
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn(),
      }
    }),
  })),
}))

describe('User Profile API', () => {
  // Mock user data
  const mockUsers = {
    user123: { id: 'user123', name: 'John Doe', email: 'john.doe@example.com' },
    user456: { id: 'user456', name: 'Jane Smith', email: 'jane.smith@example.com' },
    userWithWorkspaces: {
      id: 'userWithWorkspaces',
      name: 'Alice',
      image: null,
      workspaces: [
        { id: 'ws1', name: 'Public Workspace 1', updatedAt: '2023-01-01T10:00:00Z' },
        { id: 'ws2', name: 'Public Workspace 2', updatedAt: '2023-01-02T11:00:00Z' },
      ],
    },
  }

  let mockSupabaseFrom: any

  // Define constants for Supabase environment variables
  const SUPABASE_URL = 'http://mock.supabase.url'
  const SUPABASE_SERVICE_ROLE_KEY = 'mock_service_role_key'

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()

    // Setup mock for supabase.from().select().eq().eq().single()
    mockSupabaseFrom = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    }
    ;(createClient as jest.Mock).mockReturnValue({
      from: jest.fn(() => mockSupabaseFrom),
    })

    const req = new Request('http://localhost') // Minimal mock Request object
    process.env.SUPABASE_URL = SUPABASE_URL
    process.env.SUPABASE_SERVICE_ROLE_KEY = SUPABASE_SERVICE_ROLE_KEY
  })

  describe('GET /api/users/[userId]/profile', () => {
    it('should return 400 if userId is missing', async () => {
      const req = {} as Request // Mock request object
      // Pass params as a Promise.resolve() to match the Next.js 15 API route signature
      const response = await GET(req, { params: Promise.resolve({ userId: '' }) })

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'User ID is required.' },
        { status: 400 }
      )
      expect(response.status).toBe(400)
    })

    it('should return 404 if user profile not found in Supabase', async () => {
      mockSupabaseFrom.single.mockResolvedValue({
        data: null,
        error: { message: 'Not found', code: 'PGRST116' },
      })

      const req = {} as Request // Mock request object

      // Pass params as a Promise.resolve()
      const response = await GET(req, { params: Promise.resolve({ userId: 'nonexistent' }) })

      expect(mockSupabaseFrom.eq).toHaveBeenCalledWith('id', 'nonexistent')
      expect(mockSupabaseFrom.single).toHaveBeenCalled()
      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'User profile not found.' },
        { status: 404 }
      )
      expect(response.status).toBe(404)
    })

    it('should return user profile with public workspaces if found', async () => {
      const expectedProfile = mockUsers['userWithWorkspaces']
      mockSupabaseFrom.single.mockResolvedValue({ data: expectedProfile, error: null })

      // Pass params as a Promise.resolve()
      const req = {} as Request // Mock request object

      const response = await GET(req, { params: { userId: 'userWithWorkspaces' } })

      expect(createClient).toHaveBeenCalledWith(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
      expect(mockSupabaseFrom.select).toHaveBeenCalledWith(expect.any(String)) // Check if select is called with a string
      expect(mockSupabaseFrom.eq).toHaveBeenCalledWith('id', 'userWithWorkspaces')
      expect(mockSupabaseFrom.eq).toHaveBeenCalledWith('workspaces.isPublic', true)
      expect(mockSupabaseFrom.single).toHaveBeenCalled()
      expect(NextResponse.json).toHaveBeenCalledWith(expectedProfile)
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toEqual(expectedProfile)
    })

    it('should handle unexpected errors', async () => {
      mockSupabaseFrom.single.mockRejectedValue(new Error('Database connection failed'))

      // Pass params as a Promise.resolve()
      const req = {} as Request // Mock request object

      const response = await GET(req, { params: { userId: 'anyUser' } })

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: 'An unexpected error occurred.' },
        { status: 500 }
      )
      expect(response.status).toBe(500)
    })
  })
})
