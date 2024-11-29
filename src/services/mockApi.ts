import { mockEvents } from './mockData'
import type { Event } from '../types/event'

// Simuler un délai réseau
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const mockApi = {
  async getEvents(): Promise<Event[]> {
    await delay(500)
    return [...mockEvents]
  },

  async getEvent(id: number): Promise<Event> {
    await delay(300)
    const event = mockEvents.find(e => e.id === id)
    if (!event) {
      throw new Error('Événement non trouvé')
    }
    return { ...event }
  },

  async createEvent(event: Event): Promise<Event> {
    await delay(500)
    const newEvent = {
      ...event,
      id: Math.max(...mockEvents.map(e => e.id ?? 0)) + 1
    }
    mockEvents.push(newEvent)
    return { ...newEvent }
  },

  async updateEvent(event: Event): Promise<Event> {
    await delay(500)
    const index = mockEvents.findIndex(e => e.id === event.id)
    if (index === -1) {
      throw new Error('Événement non trouvé')
    }
    mockEvents[index] = { ...event }
    return { ...event }
  },

  async deleteEvent(id: number): Promise<void> {
    await delay(500)
    const index = mockEvents.findIndex(e => e.id === id)
    if (index === -1) {
      throw new Error('Événement non trouvé')
    }
    mockEvents.splice(index, 1)
  }
}