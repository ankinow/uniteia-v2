import { component$ } from '@builder.io/qwik'
import { routeLoader$ } from '@builder.io/qwik-city'

export const useServerTime = routeLoader$(() => {
  return {
    timestamp: new Date().toISOString(),
  }
})

export default component$(() => {
  const serverTime = useServerTime()

  return (
    <div class="min-h-screen bg-void text-white flex items-center justify-center">
      <div class="text-center">
        <h1 class="text-4xl font-bold mb-4 text-action">UniTeia v2</h1>
        <p class="text-gray-400 mb-6">Build pipeline initialized successfully</p>
        <p class="text-sm text-gray-600">Server time: {serverTime.value.timestamp}</p>
      </div>
    </div>
  )
})
