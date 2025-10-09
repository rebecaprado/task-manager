import { useAuthStore } from 'authstore/authStore';

describe('AuthStore', () => {
  it('mantém estado do usuário após login', () => {
    const { setUser } = useAuthStore.getState()
    
    const mockUser = { 
        id: '123', 
        name: 'Test User', 
        email: 'test@test.com', 
        emailVerified: true, 
        createdAt: new Date(), 
        updatedAt: new Date() 
    }

    setUser(mockUser)
    
    expect(useAuthStore.getState().user).toEqual(mockUser)
  })

  it('limpa estado após logout', () => {
    const { setUser } = useAuthStore.getState()
    
    setUser(null)
    
    expect(useAuthStore.getState().user).toBeNull()
  })
})