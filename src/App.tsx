import RootLayout from './components/Layout/RootLayout'
import { Provider } from 'react-redux'
import { store } from './store/store'

function App() {

  return (
    <Provider store={store}>
      <RootLayout />
    </Provider>
  )
}

export default App
