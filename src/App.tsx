import RootLayout from './components/Layout/RootLayout'
import { Provider } from 'react-redux'
import { store } from './store/store'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

function App() {

  const queryCLient = new QueryClient()
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryCLient}>
        <RootLayout />
      </QueryClientProvider>
    </Provider>
  )
}

export default App
