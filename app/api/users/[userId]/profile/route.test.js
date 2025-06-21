import { createMocks } from 'node-mocks-http';
import { GET, PUT } from './route';
import { NextResponse } from 'next/server';

// Mock the next/server NextResponse
jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn((data) => ({
            json: () => Promise.resolve(data),
            status: 200,
        })),
    },
}));

describe('User Profile API', () => {
    // Mock user data
    const mockUsers = {
        'user123': { id: 'user123', name: 'John Doe', email: 'john.doe@example.com' },
        'user456': { id: 'user456', name: 'Jane Smith', email: 'jane.smith@example.com' },
    };

    // Mock the database or data source
    let users = { ...mockUsers };

    beforeEach(() => {
        // Reset users data before each test
        users = { ...mockUsers };
        NextResponse.json.mockClear();
    });

    describe('GET /api/users/[userId]/profile', () => {
        it('should return 404 if user not found', async () => {
            const { req } = createMocks({
                method: 'GET',
                query: { userId: 'nonexistentUser' },
            });

            const response = await GET(req, { params: { userId: 'nonexistentUser' } });

            expect(response.status).toBe(404);
            const data = await response.json();
            expect(data.error).toBe('User not found');
        });

        it('should return user profile if user found', async () => {
            const { req } = createMocks({
                method: 'GET',
                query: { userId: 'user123' },
            });

            const response = await GET(req, { params: { userId: 'user123' } });

            expect(NextResponse.json).toHaveBeenCalledWith(mockUsers['user123']);
            expect(response.status).toBe(200);
            const data = await response.json