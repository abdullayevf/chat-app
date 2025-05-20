const API_URL = 'http://localhost:3000/api'

export const api = {
    auth: {
        login: async (email: string, password: string) => {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
            return response.json()
        },
        
        register: async (email: string, password: string) => {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
            return response.json()
        },
        
        deleteAccount: async (token: string) => {
            const response = await fetch(`${API_URL}/auth/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            return response.json()
        }
    }
}