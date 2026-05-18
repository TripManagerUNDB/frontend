// ─────────────────────────────────────────────────────────────
//  lib/api.ts  —  camada de comunicação com o backend Spring
// ─────────────────────────────────────────────────────────────

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// ── helpers ──────────────────────────────────────────────────

function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
}

async function request<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();
    const res = await fetch(API_URL + path, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || `Erro ${res.status}`);
    }

    // 204 No Content
    if (res.status === 204) return undefined as T;
    return res.json();
}

// ── Auth ─────────────────────────────────────────────────────

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    userId: string;
    name: string;
    email: string;
    plan: string;
}

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
    return request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
    });
}

export async function login(email: string, password: string): Promise<AuthResponse> {
    return request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
}

export async function getMe(): Promise<{ id: string; name: string; email: string; plan: string }> {
    return request('/auth/me');
}

// ── Trips ─────────────────────────────────────────────────────

export interface TripPayload {
    destination: string;
    checkIn: string;
    checkOut: string;
    budget: number;
    interests: string[];
    travelers: number;
    travelStyle: string;
}

export interface TripResponse {
    id: string;
    destination: string;
    checkIn: string;
    checkOut: string;
    budget: number;
    interests: string[];
    status: string;
    emoji: string;
    color: string;
    days: number;
}

export async function createTrip(data: TripPayload): Promise<TripResponse> {
    return request('/trips', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function listTrips(status?: string): Promise<TripResponse[]> {
    const qs = status ? `?status=${status}` : '';
    return request(`/trips${qs}`);
}

export async function deleteTrip(id: string): Promise<void> {
    return request(`/trips/${id}`, { method: 'DELETE' });
}

// ── Itinerary ─────────────────────────────────────────────────

export interface Coordinates {
    lat: number;
    lng: number;
}

export interface ActivityResponse {
    time: string;
    name: string;
    location: string;
    type: string;
    icon: string;
    dur: string;
    cost: number;
    estimatedCost: string;
    desc: string;
    coordinates?: Coordinates;
}

export interface MapPinResponse {
    day: number;
    time: string;
    activity: string;
    location: string;
    type: string;
    coordinates?: Coordinates;
}

export interface ItineraryDayResponse {
    id: string;
    tripId: string;
    dayNumber: number;
    date: string;
    title: string;
    activities: ActivityResponse[];
    dailyCostEstimate: string;
    mapPins: MapPinResponse[];
}

export async function generateItinerary(tripId: string): Promise<ItineraryDayResponse[]> {
    return request('/itinerary/generate', {
        method: 'POST',
        body: JSON.stringify({ tripId }),
    });
}

export async function getItinerary(tripId: string): Promise<ItineraryDayResponse[]> {
    return request(`/itinerary/${tripId}/days`);
}

// ── Costs ─────────────────────────────────────────────────────

export interface CostItem {
    label: string;
    value: number;
    pct: number;
    color: string;
}

export interface CostResponse {
    id: string;
    tripId: string;
    total: number;
    breakdown: CostItem[];
    tip: string;
}

export async function getCosts(tripId: string): Promise<CostResponse> {
    return request(`/costs/${tripId}`);
}

export async function getTip(tripId: string): Promise<{ tip: string }> {
    return request(`/costs/${tripId}/tip`);
}

// ── Auth helpers ───────────────────────────────────────────────

export function saveAuth(auth: AuthResponse) {
    localStorage.setItem('accessToken', auth.accessToken);
    localStorage.setItem('refreshToken', auth.refreshToken);
    localStorage.setItem('userId', auth.userId);
    localStorage.setItem('userName', auth.name);
    localStorage.setItem('userEmail', auth.email);
    localStorage.setItem('userPlan', auth.plan);
}

export function clearAuth() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPlan');
}

export function isLoggedIn(): boolean {
    return !!getToken();
}

export function getUserInfo() {
    return {
        name: localStorage.getItem('userName') || '',
        email: localStorage.getItem('userEmail') || '',
        plan: localStorage.getItem('userPlan') || 'FREE',
    };
}

export async function updateTripStatus(id: string, status: string): Promise<TripResponse> {
    return request(`/trips/${id}/status?status=${status}`, { method: 'PATCH' });
}
