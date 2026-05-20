import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'

import './styles/tokens.css'
import App from './App.jsx'
import { store } from './store'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)










// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import { BrowserRouter } from 'react-router-dom'
// import { Provider } from 'react-redux'

// import App from './App.jsx'
// import { store } from './store'
// import { AuthProvider } from './context/AuthContext.jsx'  // ✅ import AuthProvider
// import './styles/index.css'

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <BrowserRouter>
//         {/* ✅ Wrap your entire app in AuthProvider */}
//         <AuthProvider>
//           <App />
//         </AuthProvider>
//       </BrowserRouter>
//     </Provider>
//   </React.StrictMode>,
// )
