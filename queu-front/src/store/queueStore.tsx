import { create } from 'zustand'
import { Queue } from '@/types/queue'

interface QueueState {
  queues: Queue[]
  selectedQueue: Queue | null
  isLoading: boolean
  error: string | null
  setQueues: (queues: Queue[]) => void
  setSelectedQueue: (queue: Queue | null) => void
  addQueue: (queue: Queue) => void
  updateQueue: (queue: Queue) => void
  removeQueue: (id: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useQueueStore = create<QueueState>(set => ({
  queues: [],
  selectedQueue: null,
  isLoading: false,
  error: null,
  setQueues: queues => set({ queues }),
  setSelectedQueue: queue => set({ selectedQueue: queue }),
  addQueue: queue => set(state => ({ queues: [...state.queues, queue] })),
  updateQueue: queue =>
    set(state => ({
      queues: state.queues.map(q => (q.id === queue.id ? queue : q)),
    })),
  removeQueue: id =>
    set(state => ({
      queues: state.queues.filter(q => q.id !== id),
    })),
  setLoading: loading => set({ isLoading: loading }),
  setError: error => set({ error }),
}))
